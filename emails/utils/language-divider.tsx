import { Hr, Text } from "@react-email/components";
import { emailStyles } from "./email-styles";

type LanguageDividerProps = {
  label: string;
};

export function LanguageDivider({ label }: LanguageDividerProps) {
  return (
    <div style={emailStyles.languageDivider}>
      <Hr style={emailStyles.languageDividerLine} />
      <Text style={emailStyles.languageDividerLabel}>{label}</Text>
      <Hr style={emailStyles.languageDividerLine} />
    </div>
  );
}
