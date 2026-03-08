import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteConfig } from "@/site-config";
import { getI18n } from "@/i18n/server";
import {
  BRAND_LOGO_ALT,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PATH,
  BRAND_LOGO_WIDTH,
  getBrandLogoUrl,
} from "@/lib/brand";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  const brandLogoUrl = getBrandLogoUrl();

  return {
    metadataBase: new URL(SiteConfig.prodUrl),
    title: {
      default: SiteConfig.title,
      template: `%s · ${SiteConfig.title}`,
    },
    description: t("metadata.description"),
    applicationName: SiteConfig.title,
    icons: {
      icon: [
        {
          url: BRAND_LOGO_PATH,
          type: "image/png",
          sizes: `${BRAND_LOGO_WIDTH}x${BRAND_LOGO_HEIGHT}`,
        },
      ],
      apple: [
        {
          url: BRAND_LOGO_PATH,
          type: "image/png",
          sizes: `${BRAND_LOGO_WIDTH}x${BRAND_LOGO_HEIGHT}`,
        },
      ],
      shortcut: [BRAND_LOGO_PATH],
    },
    openGraph: {
      title: SiteConfig.title,
      description: t("metadata.description"),
      url: SiteConfig.prodUrl,
      siteName: SiteConfig.title,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
      images: [
        {
          url: brandLogoUrl,
          width: BRAND_LOGO_WIDTH,
          height: BRAND_LOGO_HEIGHT,
          alt: BRAND_LOGO_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: SiteConfig.title,
      description: t("metadata.description"),
      images: [brandLogoUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, messages } = await getI18n();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans antialiased">
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
