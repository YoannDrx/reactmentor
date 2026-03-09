import { BRAND_LOGO_ALT } from "@/lib/brand";
import type { Locale } from "@/i18n/config";
import { SiteConfig } from "@/site-config";
import type {
  LifecycleEmailContent,
  LifecycleEmailMetaRow,
} from "@/features/emails/lifecycle-email-content";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { PropsWithChildren } from "react";
import { emailStyles } from "./email-styles";

type ReactMentorEmailLayoutProps = PropsWithChildren<{
  preview: string;
}>;

type ReactMentorEmailSectionProps = {
  locale: Locale;
  languageLabel: string;
  content: LifecycleEmailContent;
  ctaUrl: string;
  footerUrl: string;
};

const logoUrl = new URL(SiteConfig.logoPath, SiteConfig.prodUrl).toString();

export function ReactMentorEmailLayout(props: ReactMentorEmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{props.preview}</Preview>
      <Body style={emailStyles.body}>
        <Container style={emailStyles.container}>
          <Section style={emailStyles.accentBar} />
          <Section style={emailStyles.hero}>
            <Img
              src={logoUrl}
              alt={BRAND_LOGO_ALT}
              width={56}
              height={56}
              style={emailStyles.logo}
            />
            <Text style={emailStyles.eyebrow}>React Mentor</Text>
            <Text style={emailStyles.eyebrowSecondary}>
              English / Francais
            </Text>
            <Heading as="h1" style={emailStyles.title}>
              Interview prep update
            </Heading>
            <Text style={emailStyles.titleSecondary}>
              Mise a jour de preparation entretien
            </Text>
            <Text style={emailStyles.intro}>
              English section first, French section just below.
            </Text>
            <Text style={emailStyles.introSecondary}>
              Section anglaise d&apos;abord, section francaise juste apres.
            </Text>
          </Section>

          <Section style={emailStyles.content}>{props.children}</Section>

          <Section style={emailStyles.siteFooter}>
            <Img
              src={logoUrl}
              alt={BRAND_LOGO_ALT}
              width={24}
              height={24}
              style={{
                display: "block",
                margin: "0 auto",
                borderRadius: "6px",
              }}
            />
            <Text style={emailStyles.siteFooterText}>
              {SiteConfig.title} · {SiteConfig.domain}
            </Text>
            <Text style={emailStyles.automationText}>
              {`This email was sent automatically by ${SiteConfig.title}.`}
            </Text>
            <Text style={emailStyles.automationTextSecondary}>
              {`Cet email a ete envoye automatiquement par ${SiteConfig.title}.`}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function ReactMentorEmailSection(
  props: ReactMentorEmailSectionProps,
) {
  return (
    <Section
      lang={props.locale}
      dir="ltr"
      data-lang={props.locale}
      style={emailStyles.languageSection}
    >
      <Text style={emailStyles.languageLabel}>{props.languageLabel}</Text>
      <Text style={emailStyles.sectionEyebrow}>{props.content.eyebrow}</Text>
      <Heading as="h2" style={emailStyles.sectionTitle}>
        {props.content.title}
      </Heading>
      <Text style={emailStyles.sectionIntro}>{props.content.intro}</Text>

      {props.content.bodyParagraphs.map((paragraph) => (
        <Text key={`${props.locale}-${paragraph}`} style={emailStyles.bodyText}>
          {paragraph}
        </Text>
      ))}

      {props.content.metaRows.length ? (
        <Section style={emailStyles.metaCard}>
          <table
            role="presentation"
            cellPadding={0}
            cellSpacing={0}
            style={emailStyles.metaTable}
          >
            <tbody>
              {props.content.metaRows.map((row: LifecycleEmailMetaRow) => (
                <tr key={`${props.locale}-${row.label}-${row.value}`}>
                  <td style={emailStyles.metaLabel}>{row.label}</td>
                  <td style={emailStyles.metaValue}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      ) : null}

      <Section style={emailStyles.ctaSection}>
        <Button href={props.ctaUrl} style={emailStyles.primaryButton}>
          {props.content.ctaLabel}
        </Button>
      </Section>

      <Text style={emailStyles.footerText}>{props.content.footerText}</Text>
      <Link href={props.footerUrl} style={emailStyles.footerLink}>
        {props.content.footerLinkLabel}
      </Link>
    </Section>
  );
}
