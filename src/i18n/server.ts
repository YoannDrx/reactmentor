import { cookies } from "next/headers";
import { defaultLocale, isLocale, localeCookieName, type Locale } from "./config";
import { messages } from "./messages";
import { createTranslator } from "./translator";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  return defaultLocale;
}

export async function getI18n() {
  const locale = await getLocale();
  const dictionary = messages[locale];

  return {
    locale,
    messages: dictionary,
    t: createTranslator(dictionary),
  };
}
