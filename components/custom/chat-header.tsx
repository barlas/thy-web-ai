'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'usehooks-ts';

import { SidebarToggle } from '@/components/custom/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { BetterTooltip } from '@/components/ui/tooltip';

import { PlusIcon } from './icons';
import { LanguageSelector } from './language-selector';
import { ThemeSelector } from './theme-selector';
import { useSidebar } from '../ui/sidebar';

export function ChatHeader({ selectedModelId }: { selectedModelId: string }) {
  const router = useRouter();
  const { open } = useSidebar();
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />
      {(!open || windowWidth < 768) && (
        <BetterTooltip content={t('common.newChat')}>
          <Button
            variant="outline"
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
            onClick={() => {
              router.push('/');
              router.refresh();
            }}
          >
            <PlusIcon />
            <span className="md:sr-only">{t('common.newChat')}</span>
          </Button>
        </BetterTooltip>
      )}
      <LanguageSelector className="order-1 md:order-2" />
      <ThemeSelector />
    </header>
  );
}
