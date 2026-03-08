import { Track } from "@prisma/client";
import { Text } from "@react-email/components";
import type { Locale } from "@/i18n/config";
import {
  buildWelcomeLifecycleEmailContent,
  type LifecycleEmailContent,
} from "@/features/emails/lifecycle-email-content";
import { SiteConfig } from "@/site-config";
import { emailStyles } from "./utils/email-styles";
import { ReactMentorEmailLayout } from "./utils/email-layout";

export type WelcomeLifecycleEmailProps = {
  content?: LifecycleEmailContent;
  ctaUrl?: string;
  footerUrl?: string;
};

function getDefaultContent() {
  return buildWelcomeLifecycleEmailContent({
    locale: "fr" satisfies Locale,
    userName: "Alex Mentor",
    targetRole: "Senior Frontend Engineer",
    preferredTracks: [Track.REACT, Track.TYPESCRIPT],
  });
}

export default function WelcomeLifecycleEmail({
  content = getDefaultContent(),
  ctaUrl = `${SiteConfig.prodUrl}/dashboard`,
  footerUrl = `${SiteConfig.prodUrl}/dashboard/settings`,
}: WelcomeLifecycleEmailProps) {
  return (
    <ReactMentorEmailLayout
      preview={content.preview}
      locale={content.locale}
      eyebrow={content.eyebrow}
      title={content.title}
      intro={content.intro}
      ctaLabel={content.ctaLabel}
      ctaUrl={ctaUrl}
      footerText={content.footerText}
      footerLinkLabel={content.footerLinkLabel}
      footerUrl={footerUrl}
      metaRows={content.metaRows}
    >
      {content.bodyParagraphs.map((paragraph) => (
        <Text key={paragraph} style={emailStyles.bodyText}>
          {paragraph}
        </Text>
      ))}
    </ReactMentorEmailLayout>
  );
}
