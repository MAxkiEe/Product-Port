import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationTH from './locales/th.json';

// the translations
const resources = {
    en: translationEN,
    th: translationTH
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'th', // Default to Thai
        debug: false,
        interpolation: {
            escapeValue: false, // React already safeguards from xss
        }
    });

export default i18n;
