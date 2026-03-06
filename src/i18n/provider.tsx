"use client";

import {
  createContext,
  startTransition,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { defaultLocale, localeCookieName, type Locale } from "./config";
import { messages, type Messages } from "./messages";
import { createTranslator } from "./translator";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  t: ReturnType<typeof createTranslator>;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale,
  initialMessages,
}: {
  children: ReactNode;
  locale: Locale;
  initialMessages: Messages;
}) {
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
  const [currentMessages, setCurrentMessages] = useState<Messages>(initialMessages);

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale: currentLocale,
      messages: currentMessages,
      t: createTranslator(currentMessages),
      setLocale: (nextLocale) => {
        if (nextLocale === currentLocale) return;

        document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        setCurrentLocale(nextLocale);
        setCurrentMessages(messages[nextLocale] ?? messages[defaultLocale]);
        startTransition(() => {
          router.refresh();
        });
      },
    };
  }, [currentLocale, currentMessages, router]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
