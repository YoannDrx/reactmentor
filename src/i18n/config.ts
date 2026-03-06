export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";
export const localeCookieName = "react-mentor-locale";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
