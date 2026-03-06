import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { SiteConfig } from "@/site-config";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();

  return {
    metadataBase: new URL(SiteConfig.prodUrl),
    title: {
      default: SiteConfig.title,
      template: `%s · ${SiteConfig.title}`,
    },
    description: t("metadata.description"),
    applicationName: SiteConfig.title,
    openGraph: {
      title: SiteConfig.title,
      description: t("metadata.description"),
      url: SiteConfig.prodUrl,
      siteName: SiteConfig.title,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: SiteConfig.title,
      description: t("metadata.description"),
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
