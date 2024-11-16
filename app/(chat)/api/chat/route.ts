import {
  convertToCoreMessages,
  Message,
  StreamData,
  streamObject,
  streamText
} from 'ai';
import { z } from 'zod';

import { customModel } from '@/ai';
import { models } from '@/ai/models';
import { systemPrompt } from '@/ai/prompts';
import { auth } from '@/app/(auth)/auth';
import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';

export const maxDuration = 60;

type AllowedTools =
  | 'getWeather'
  | 'getMenu';

const weatherTools: AllowedTools[] = ['getWeather'];
const menuTools: AllowedTools[] = ['getMenu'];

const allTools: AllowedTools[] = [...weatherTools, ...menuTools];

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }

  await saveMessages({
    messages: [
      { ...userMessage, id: generateUUID(), createdAt: new Date(), chatId: id },
    ],
  });

  const streamingData = new StreamData();

  const result = await streamText({
    model: customModel(model.apiIdentifier),
    system: systemPrompt,
    messages: coreMessages,
    maxSteps: 5,
    experimental_activeTools: allTools,
    tools: {
      getMenu: {
        description: 'Request information on dietary options for meal menu items',
        parameters: z.object({
          content: z.string().describe('The whole content of the menu.'),
        }),
        execute: async ({ content }) => {
          const schema = z.object({
            mealServices: z.array(
              z.object({
                mealServiceType: z.string(),
                selectionOptions: z.array(
                  z.array(
                    z.object({
                      selectionGuidanceText: z.string().optional(),
                      dishName: z.string(),
                      ingredients: z.string().optional(),
                      separatorAndOr: z.string().optional(),
                    })
                  )
                ),
              })
            ),
            footerDisclaimer: z.string(),
            isBusiness: z.boolean(),
          });
          
          // streamObject to generate and stream the JSON object
          const { textStream, object } = await streamObject({
            model: customModel(model.apiIdentifier),
            system: `You are a helpful in-flight assistant. Based on the description, please provide information.`,
            prompt: content,
            output: 'object',
            schema: schema,
          });
      
          // Stream the JSON text to the client
          for await (const textChunk of textStream) {
            streamingData.append({
              type: 'text-delta',
              content: textChunk,
            });
          }
      
          // Indicate that the streaming is finished
          streamingData.append({ type: 'finish', content: '' });
      
          // Get the final parsed object
          const parsedData = await object;
          return parsedData;
        },
      },
      getWeather: {
        description: 'Get the current weather at a city',
        parameters: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        execute: async ({ latitude, longitude }) => {
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
          );

          const weatherData = await response.json();
          return weatherData;
        },
      },
    },
    onFinish: async ({ responseMessages }) => {
      if (session.user && session.user.id) {
        try {
          const responseMessagesWithoutIncompleteToolCalls =
            sanitizeResponseMessages(responseMessages);

          // Check if we have valid messages to save
          if (!responseMessagesWithoutIncompleteToolCalls?.length) {
            throw new Error('No valid messages to save');
          }

          const messagesToSave = responseMessagesWithoutIncompleteToolCalls
            .filter(message => message.content && typeof message.content === 'string')
            .map((message) => {
              const messageId = generateUUID();

              if (message.role === 'assistant') {
                streamingData.appendMessageAnnotation({
                  messageIdFromServer: messageId,
                });
              }

              return {
                id: messageId,
                chatId: id,
                role: message.role,
                content: message.content,
                createdAt: new Date(),
              };
            });

          if (messagesToSave.length > 0) {
            await saveMessages({
              messages: messagesToSave,
            });
          } else {
            throw new Error('No valid messages to save after filtering');
          }

        } catch (error) {
          console.error('Failed to save chat', error);
          streamingData.append({
            type: 'error',
            error: 'Failed to save messages'
          });
        }
      }

      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: false,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
