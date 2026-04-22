'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  type Language,
  translations,
  STORAGE_KEY,
} from './translations';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
interface I18nContextValue {
  /** Current active language */
  language: Language;
  /** Switch language (persists to localStorage) */
  setLanguage: (lang: Language) => void;
  /**
   * Translate a key. Returns the English fallback (or the raw key) when the
   * key is missing for the current language. Supports `{param}` interpolation.
   *
   * @example t('footer.rights', { year: '2026' })
   */
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (stored && (stored === 'en' || stored === 'es' || stored === 'pt')) {
        setLanguageState(stored);
      }
    } catch {
      // SSR or localStorage unavailable — keep default
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // silent
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      // Look up in current language, fallback to English, fallback to key
      let value =
        translations[language]?.[key] ??
        translations.en[key] ??
        key;

      // Interpolate {param} tokens
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }
      }

      return value;
    },
    [language],
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useI18n() {
  return useContext(I18nContext);
}
