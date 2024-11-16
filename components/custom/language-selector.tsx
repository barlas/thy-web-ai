'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import i18n from '@/i18n';

import { CheckCirclFillIcon, ChevronDownIcon } from './icons';

const languages = [
  { id: 'en', label: 'English' },
  { id: 'tr', label: 'Türkçe' },
];

export function LanguageSelector({
  className,
}: React.ComponentProps<typeof Button>) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [locale, setLocale] = useLocalStorage('locale', 'en');

  const selectedLanguage = useMemo(
    () => languages.find((lang) => lang.id === locale),
    [locale]
  );

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  if (!hasHydrated) {
    // Defer rendering until after hydration
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className={`w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground ${className}`}
      >
        <Button variant="outline" className="md:px-2 md:h-[34px]">
          {selectedLanguage?.label}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.id}
            onSelect={() => {
              setLocale(lang.id);
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={lang.id === locale}
          >
            <div className="flex flex-col gap-1 items-start">
              {lang.label}
            </div>
            <div className="text-primary dark:text-primary-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCirclFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
