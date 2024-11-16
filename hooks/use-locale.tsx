import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

import i18n from '@/i18n';

export function useLocale() {
  const [locale, setLocale] = useLocalStorage('locale', 'en');

  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale]);

  return [locale, setLocale] as const;
}
