'use client';

import React from 'react';
import { Toaster } from 'sonner';

import { I18nProvider } from '@/components/custom/i18n-provider';
import { ThemeProvider } from '@/components/custom/theme-provider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <I18nProvider>
        <Toaster position="top-center" />
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
