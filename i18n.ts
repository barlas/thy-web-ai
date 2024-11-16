import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './public/locales/en/common.json';
import tr from './public/locales/tr/common.json';

const i18n = createInstance();

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      tr: { common: tr }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { 
      escapeValue: false,
      prefix: '{',
      suffix: '}'
    },
    ns: ['common'],
    defaultNS: 'common'
  });

export default i18n;