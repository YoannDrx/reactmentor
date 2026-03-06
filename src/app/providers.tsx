"use client";

import { I18nProvider } from "@/i18n/provider";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { Toaster } from "sonner";

export function Providers({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: Locale;
  messages: Messages;
}) {
  return (
    <I18nProvider locale={locale} initialMessages={messages}>
      {children}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          classNames: {
            toast: "!rounded-2xl !border !border-white/50 !bg-white/90 !text-slate-950",
          },
        }}
      />
    </I18nProvider>
  );
}
