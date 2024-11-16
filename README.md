<a href="https://chat.vercel.ai/">
  <h1 align="center">Turkish Airlines In-Flight Assistant</h1>
</a>

<p align="center">
  An AI-powered virtual assistant designed to enhance passenger experience by providing real-time flight information, menu recommendations, and addressing in-flight queries through natural conversation.
</p>

<p align="center">
  <a href="#architecture-overview"><strong>Architecture</strong></a> ·
  <a href="#setup-instructions"><strong>Setup</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a>
</p>
<br/>

## Architecture

Uses a modern, modular architecture designed for scalability and performance.

### 🎨 Frontend

- **[Next.js](https://nextjs.org) App Router**
  - Client-side routing and server-side rendering
  - React Server Components (RSCs)
- **[shadcn/ui](https://ui.shadcn.com) Components**
  - Built on [Radix UI](https://radix-ui.com) primitives
  - Styled with [Tailwind CSS](https://tailwindcss.com)
- **Internationalization**
  - Supports multiple languages using [next-i18next](https://github.com/isaachinman/next-i18next).

### 🔧 Backend

- **API Routes**
  - `/api/chat`: Message processing
  - `/api/files/upload`: File management
- **Authentication**
  - Secure user sessions via [NextAuth.js](https://github.com/nextauthjs/next-auth)
- **Data Storage**
  - [Vercel Postgres](https://vercel.com/storage/postgres): User data and chat histories
  - [Vercel Blob](https://vercel.com/storage/blob): Media and file storage

### 🤖 AI Integration

- **[AI SDK](https://sdk.vercel.ai/docs)**
  - OpenAI `GPT-4o` integration
  - Message streaming and response processing
- **Custom Tools**
  - `getMenu`: OCR-based menu extraction
  - `getWeather`: Real-time weather information

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) package manager
- [Vercel](https://vercel.com/) account
- [OpenAI API key](https://platform.openai.com/api-keys)

### Installation Steps

1. Set up environment variables:

```bash
npm i -g vercel
vercel link    # Link to Vercel project
vercel env pull # Pull environment variables
```

2. Install and run:

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)

Pushing changes to the main branch will automatically trigger a production deployment via Vercel's CI/CD pipeline.
