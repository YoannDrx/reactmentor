import "./utils/react-email-node-polyfills";
import { Track } from "@prisma/client";
import type { Locale } from "@/i18n/config";
import {
  buildWelcomeLifecycleEmailContent,
  type LifecycleEmailContent,
} from "@/features/emails/lifecycle-email-content";
import { SiteConfig } from "@/site-config";
import { LanguageDivider } from "./utils/language-divider";
import {
  ReactMentorEmailLayout,
  ReactMentorEmailSection,
} from "./utils/email-layout";

export type WelcomeLifecycleEmailProps = {
  englishContent?: LifecycleEmailContent;
  frenchContent?: LifecycleEmailContent;
  ctaUrl?: string;
  footerUrl?: string;
};

function getDefaultContent(locale: Locale) {
  return buildWelcomeLifecycleEmailContent({
    locale,
    userName: "Alex Mentor",
    targetRole: "Senior Frontend Engineer",
    preferredTracks: [Track.REACT, Track.TYPESCRIPT],
  });
}

export default function WelcomeLifecycleEmail({
  englishContent = getDefaultContent("en"),
  frenchContent = getDefaultContent("fr"),
  ctaUrl = `${SiteConfig.prodUrl}/dashboard`,
  footerUrl = `${SiteConfig.prodUrl}/dashboard/settings`,
}: WelcomeLifecycleEmailProps) {
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
