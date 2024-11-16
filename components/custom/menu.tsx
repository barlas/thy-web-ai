'use client';

import { t } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';

export const SAMPLE: Menu = {
  mealServices: [
    {
      mealServiceType: '...',
      selectionOptions: [[{ dishName: '...' }]],
    },
  ],
  footerDisclaimer: '...',
  isBusiness: false,
};

interface Menu {
  mealServices: {
    mealServiceType: string;
    selectionOptions: {
      selectionGuidanceText?: string;
      dishName: string;
      ingredients?: string;
      separatorAndOr?: string;
    }[][];
  }[];
  footerDisclaimer: string;
  isBusiness: boolean;
}

const LoadingMenu = () => (
  <Card className="bg-background dark:bg-slate-900 text-foreground dark:text-white text-sm">
    <CardContent className="p-6">
      <div className="flex justify-center gap-4 mb-6">
        <Skeleton className="h-7 w-32 rounded-full" />
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-3 mb-4">
          <div className="flex flex-col items-center gap-1.5">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-48 opacity-70" />
          </div>
        </div>
      ))}
      <Skeleton className="h-16 w-full mt-4 opacity-50" />
    </CardContent>
  </Card>
);

interface MenuProps {
  menu?: Menu;
  loading?: boolean;
  onSelectDish?: (dish: string, ingredients?: string) => void;
}

export function Menu({
  menu = SAMPLE,
  loading = false,
  onSelectDish,
}: MenuProps) {
  const safeMenu = menu && menu.mealServices ? menu : { mealServices: [] };
  const [activeCourseIndex, setActiveCourseIndex] = useState(0);
  const hasMultipleCourses = safeMenu.mealServices.length > 1;
  const { t } = useTranslation();

  const handleDishClick = (dishName: string, ingredients?: string) => {
    const prompt = ingredients
      ? t('menu.tellMeMoreWithIngredients', { dishName, ingredients })
      : t('menu.tellMeMore', { dishName });
    onSelectDish?.(prompt);
  };

  if (loading) return <LoadingMenu />;

  return (
    <div className="flex-1 w-full">
      <Card className="bg-background dark:bg-slate-900 text-foreground dark:text-white text-sm">
        <CardContent className="p-6">
          {hasMultipleCourses && (
            <div className="flex justify-center gap-4 mb-6">
              {safeMenu.mealServices.map((meal, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCourseIndex(idx)}
                  className={`px-6 py-1.5 rounded-full text-sm transition-colors ${
                    idx === activeCourseIndex
                      ? 'bg-[#E81932] text-white'
                      : 'text-[#E81932] hover:bg-muted/80 dark:hover:bg-slate-800'
                  }`}
                >
                  {meal.mealServiceType}
                </button>
              ))}
            </div>
          )}

          {safeMenu.mealServices.map((meal, idx) => {
            if (hasMultipleCourses && idx !== activeCourseIndex) return null;

            return (
              <div key={idx} className="space-y-4 max-w-2xl mx-auto">
                {meal.selectionOptions.map((optionGroup, groupIdx) => (
                  <div key={groupIdx} className="space-y-3">
                    {optionGroup.map((item, itemIdx) => (
                      <div key={itemIdx} className="text-center">
                        {item.selectionGuidanceText && (
                          <p className="text-xs text-[#666]/80 dark:text-[#666]/60 italic mb-1">
                            {item.selectionGuidanceText}
                          </p>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                className="flex flex-col items-center gap-0.5 w-full transition-colors hover:bg-muted/50 dark:hover:bg-slate-800/50 rounded-md p-1"
                                onClick={() =>
                                  handleDishClick(
                                    item.dishName,
                                    item.ingredients
                                  )
                                }
                              >
                                <div className="flex items-center justify-center gap-2 w-full">
                                  {item.separatorAndOr && (
                                    <span className="text-sm text-[#666]/80 dark:text-[#666]/60 min-w-[40px] text-right">
                                      {item.separatorAndOr}
                                    </span>
                                  )}
                                  <span className="font-medium text-foreground dark:text-white">
                                    {item.dishName.toUpperCase()}
                                    {item.ingredients && (
                                      <span className="text-xs italic ml-2">
                                        ({item.ingredients})
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t('menu.askMeAnything')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          })}

          {menu.footerDisclaimer && (
            <div className="mt-4 text-center text-[11px] max-w-2xl mx-auto text-[#666]/70 dark:text-[#666]/50 leading-tight">
              {menu.footerDisclaimer}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
