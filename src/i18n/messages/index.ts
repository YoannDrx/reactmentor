import en from "./en";
import fr from "./fr";

type WidenLiteral<T> =
  T extends string ? string
  : T extends number ? number
  : T extends boolean ? boolean
  : T extends readonly (infer U)[] ? ReadonlyArray<WidenLiteral<U>>
  : T extends object ? { [K in keyof T]: WidenLiteral<T[K]> }
  : T;

export type Messages = WidenLiteral<typeof fr>;

export const messages: Record<"fr" | "en", Messages> = {
  fr,
  en,
};
