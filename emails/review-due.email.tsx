import "./utils/react-email-node-polyfills";
import type { Locale } from "@/i18n/config";
import {
  buildReviewDueLifecycleEmailContent,
  type LifecycleEmailContent,
} from "@/features/emails/lifecycle-email-content";
import { SiteConfig } from "@/site-config";
import { LanguageDivider } from "./utils/language-divider";
import {
  ReactMentorEmailLayout,
  ReactMentorEmailSection,
} from "./utils/email-layout";

export type ReviewDueEmailProps = {
  englishContent?: LifecycleEmailContent;
  frenchContent?: LifecycleEmailContent;
  ctaUrl?: string;
  footerUrl?: string;
};

function getDefaultContent(locale: Locale) {
  return buildReviewDueLifecycleEmailContent({
    locale,
    userName: "Jane Candidate",
    dueCount: 6,
    moduleTitle: "React Rendering Systems",
    skillTitle: "Rendering mental model",
  });
}

export default function ReviewDueEmail({
  englishContent = getDefaultContent("en"),
  frenchContent = getDefaultContent("fr"),
  ctaUrl = `${SiteConfig.prodUrl}/dashboard/review`,
  footerUrl = `${SiteConfig.prodUrl}/dashboard/settings`,
}: ReviewDueEmailProps) {
  return (
    <ReactMentorEmailLayout
      preview={`${englishContent.preview} / ${frenchContent.preview}`}
    >
      <ReactMentorEmailSection
        locale="en"
        languageLabel="English version"
        content={englishContent}
        ctaUrl={ctaUrl}
        footerUrl={footerUrl}
      />
      <LanguageDivider label="Version française" />
      <ReactMentorEmailSection
        locale="fr"
        languageLabel="Version française"
        content={frenchContent}
        ctaUrl={ctaUrl}
        footerUrl={footerUrl}
      />
    </ReactMentorEmailLayout>
  );
}
