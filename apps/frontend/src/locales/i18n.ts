import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en/translations.json';
import { ConvertedToObjectType } from './types';

const translationsJson = {
  en: {
    translation: en,
  },
};

export const languages = Object.keys(translationsJson);

export const languageLocalStorageKey = 'i18nextLng_dapp';
export const walletLanguageLocalStorageKey = 'i18nextLng'; // language key for @sovryn/react-wallet

export type TranslationResource = typeof en;
export type LanguageKey = keyof TranslationResource;

export const translations: ConvertedToObjectType<TranslationResource> =
  {} as ConvertedToObjectType<TranslationResource>;

/*
 * Converts the static JSON file into an object where keys are identical
 * but values are strings concatenated according to syntax.
 * This is helpful when using the JSON file keys and still have the intellisense support
 * along with type-safety
 */
const convertLanguageJsonToObject = (obj: {}, dict: {}, current?: string) => {
  Object.keys(obj).forEach(key => {
    const currentLookupKey = current ? `${current}.${key}` : key;
    if (typeof obj[key] === 'object') {
      dict[key] = {};
      convertLanguageJsonToObject(obj[key], dict[key], currentLookupKey);
    } else {
      dict[key] = currentLookupKey;
    }
  });
};

export const i18n = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init(
    {
      resources: translationsJson,
      react: {
        useSuspense: true,
      },
      fallbackLng: 'en',
      supportedLngs: languages,
      detection: {
        order: ['localStorage', 'navigator'],
        // needs to be different from default to prevent overwrite by @sovryn/react-wallet
        lookupLocalStorage: languageLocalStorageKey,
        // don't cache automatically into localStorage only on manual language change
        caches: [],
        excludeCacheFor: ['cimode'],
      },
    },
    error => {
      if (error) {
        console.error(error);
      }
      convertLanguageJsonToObject(en, translations);
    },
  );
