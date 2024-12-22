import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translations';
import it from './locales/it/translations';

const resources = {
  en: {
    translation: en
  },
  it: {
    translation: it
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    preload: ["en", "it"]
  });

export default i18n;