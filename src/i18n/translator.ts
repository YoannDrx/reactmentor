import type { Messages } from "./messages";

type Primitive = string | number;

const getNestedValue = (obj: unknown, path: string): unknown => {
  return path.split(".").reduce<unknown>((current, segment) => {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, obj);
};

const interpolate = (
  value: string,
  variables?: Record<string, Primitive>,
) => {
  if (!variables) return value;

  return value.replace(/\{(\w+)\}/g, (_, key: string) => {
    return variables[key] !== undefined ? String(variables[key]) : `{${key}}`;
  });
};

export function createTranslator(dictionary: Messages) {
  return (key: string, variables?: Record<string, Primitive>) => {
    const value = getNestedValue(dictionary, key);

    if (typeof value !== "string") {
      return key;
    }

    return interpolate(value, variables);
  };
}

export function getMessageValue<T = unknown>(dictionary: Messages, path: string) {
  return getNestedValue(dictionary, path) as T;
}
