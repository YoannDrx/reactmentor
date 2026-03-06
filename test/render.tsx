import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import type { ReactElement } from "react";
import { I18nProvider } from "@/i18n/provider";
import { messages } from "@/i18n/messages";

export function renderWithApp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(
      <I18nProvider locale="en" initialMessages={messages.en}>
        {jsx}
      </I18nProvider>,
    ),
  };
}
