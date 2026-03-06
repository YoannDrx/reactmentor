"use client";

import { locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-white/85 p-1 shadow-[0_12px_30px_-24px_rgba(15,23,32,0.45)] backdrop-blur-sm",
        className,
      )}
      aria-label={t("common.language")}
      role="group"
    >
      {locales.map((value) => {
        const active = locale === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setLocale(value as Locale)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold tracking-[0.18em] transition-all",
              active
                ? "bg-slate-950 text-white"
                : "text-slate-500 hover:text-slate-950",
            )}
          >
            {t(`common.locales.${value}`)}
          </button>
        );
      })}
    </div>
  );
}
