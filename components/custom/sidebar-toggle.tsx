import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { BetterTooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

import { SidebarLeftIcon } from './icons';
import { Button } from '../ui/button';

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar();
  const { t } = useTranslation();
  return (
    <BetterTooltip content={t('common.toggleSidebar')} align="start">
      <Button
        onClick={toggleSidebar}
        variant="outline"
        className="md:px-2 md:h-fit"
      >
        <SidebarLeftIcon size={16} />
      </Button>
    </BetterTooltip>
  );
}
