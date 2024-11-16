'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from '@/components/custom/icons';
import { Button } from '@/components/ui/button';

export function ThemeSelector() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  const currentTheme = theme === 'system' ? systemTheme : theme;
  
  return (
    <Button
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      variant="ghost"
      size="sm"
      className="border text-foreground size-8"
      aria-label="Toggle theme"
    >
      {currentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}