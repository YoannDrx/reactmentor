import { Text } from "@react-email/components";
import type { Locale } from "@/i18n/config";
import {
  buildReviewDueLifecycleEmailContent,
  type LifecycleEmailContent,
} from "@/features/emails/lifecycle-email-content";
import { SiteConfig } from "@/site-config";
import { emailStyles } from "./utils/email-styles";
import { ReactMentorEmailLayout } from "./utils/email-layout";

export type ReviewDueEmailProps = {
  content?: LifecycleEmailContent;
  ctaUrl?: string;
  footerUrl?: string;
};

function getDefaultContent() {
  return buildReviewDueLifecycleEmailContent({
    locale: "en" satisfies Locale,
    userName: "Jane Candidate",
    dueCount: 6,
    moduleTitle: "React Rendering Systems",
    skillTitle: "Rendering mental model",
  });
}

export default function ReviewDueEmail({
  content = getDefaultContent(),
  ctaUrl = `${SiteConfig.prodUrl}/dashboard/review`,
  footerUrl = `${SiteConfig.prodUrl}/dashboard/settings`,
}: ReviewDueEmailProps) {
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
