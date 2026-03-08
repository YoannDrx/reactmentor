import { BRAND_LOGO_ALT } from "@/lib/brand";
import type { Locale } from "@/i18n/config";
import { SiteConfig } from "@/site-config";
import type { LifecycleEmailMetaRow } from "@/features/emails/lifecycle-email-content";
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
  locale: Locale;
  eyebrow: string;
  title: string;
  intro: string;
  ctaLabel: string;
  ctaUrl: string;
  footerText: string;
  footerLinkLabel: string;
  footerUrl: string;
  metaRows?: LifecycleEmailMetaRow[];
}>;

const logoUrl = new URL(SiteConfig.logoPath, SiteConfig.prodUrl).toString();

export function ReactMentorEmailLayout(props: ReactMentorEmailLayoutProps) {
  return (
    <Html lang={props.locale}>
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
            <Text style={emailStyles.eyebrow}>{props.eyebrow}</Text>
            <Heading as="h1" style={emailStyles.title}>
              {props.title}
            </Heading>
            <Text style={emailStyles.intro}>{props.intro}</Text>
          </Section>

          <Section style={emailStyles.content}>
            {props.children}

            {props.metaRows?.length ? (
              <Section style={emailStyles.metaCard}>
                <table
                  role="presentation"
                  cellPadding={0}
                  cellSpacing={0}
                  style={emailStyles.metaTable}
                >
                  <tbody>
                    {props.metaRows.map((row) => (
                      <tr key={`${row.label}-${row.value}`}>
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
                {props.ctaLabel}
              </Button>
            </Section>

            <Text style={emailStyles.footerText}>{props.footerText}</Text>
            <Link href={props.footerUrl} style={emailStyles.footerLink}>
              {props.footerLinkLabel}
            </Link>
          </Section>

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
              {props.locale === "en"
                ? `This email was sent automatically by ${SiteConfig.title}.`
                : `Cet email a ete envoye automatiquement par ${SiteConfig.title}.`}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
