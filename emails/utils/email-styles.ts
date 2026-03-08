import type { CSSProperties } from "react";
import { SiteConfig } from "@/site-config";

export const emailStyles = {
  body: {
    margin: "0",
    padding: "32px 16px",
    backgroundColor: "#eff6ff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: SiteConfig.brand.ink,
  } satisfies CSSProperties,
  container: {
    maxWidth: "640px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "28px",
    border: "1px solid rgba(15, 23, 32, 0.08)",
    overflow: "hidden",
    boxShadow: "0 30px 90px -55px rgba(15, 23, 32, 0.45)",
  } satisfies CSSProperties,
  accentBar: {
    height: "6px",
    background: `linear-gradient(90deg, ${SiteConfig.brand.primary}, ${SiteConfig.brand.secondary})`,
    backgroundColor: SiteConfig.brand.primary,
  } satisfies CSSProperties,
  hero: {
    padding: "30px 32px 22px",
    backgroundColor: SiteConfig.brand.ink,
  } satisfies CSSProperties,
  logo: {
    display: "block",
    margin: "0 0 18px",
    borderRadius: "16px",
  } satisfies CSSProperties,
  eyebrow: {
    margin: "0",
    fontSize: "12px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#7dd3fc",
  } satisfies CSSProperties,
  title: {
    margin: "16px 0 0",
    fontSize: "30px",
    lineHeight: "36px",
    fontWeight: "700",
    color: "#ffffff",
  } satisfies CSSProperties,
  intro: {
    margin: "14px 0 0",
    fontSize: "16px",
    lineHeight: "26px",
    color: "#cbd5e1",
  } satisfies CSSProperties,
  content: {
    padding: "30px 32px 32px",
  } satisfies CSSProperties,
  bodyText: {
    margin: "0 0 16px",
    fontSize: "15px",
    lineHeight: "26px",
    color: "#334155",
  } satisfies CSSProperties,
  metaCard: {
    margin: "18px 0 26px",
    padding: "18px 20px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  } satisfies CSSProperties,
  metaTable: {
    width: "100%",
    borderCollapse: "collapse",
  } satisfies CSSProperties,
  metaLabel: {
    padding: "0 0 10px",
    color: "#475569",
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  } satisfies CSSProperties,
  metaValue: {
    padding: "0 0 10px",
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: "600",
    textAlign: "right",
  } satisfies CSSProperties,
  ctaSection: {
    marginTop: "24px",
  } satisfies CSSProperties,
  primaryButton: {
    display: "inline-block",
    borderRadius: "999px",
    backgroundColor: SiteConfig.brand.ink,
    color: "#ffffff",
    padding: "14px 22px",
    fontSize: "15px",
    fontWeight: "600",
    textDecoration: "none",
  } satisfies CSSProperties,
  footerText: {
    margin: "22px 0 0",
    fontSize: "13px",
    lineHeight: "22px",
    color: "#64748b",
  } satisfies CSSProperties,
  footerLink: {
    fontSize: "13px",
    lineHeight: "20px",
    color: SiteConfig.brand.primary,
    textDecoration: "underline",
  } satisfies CSSProperties,
  siteFooter: {
    padding: "20px 24px 24px",
    textAlign: "center",
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
  } satisfies CSSProperties,
  siteFooterText: {
    margin: "10px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  } satisfies CSSProperties,
  automationText: {
    margin: "4px 0 0",
    fontSize: "11px",
    color: "#cbd5e1",
  } satisfies CSSProperties,
} as const;
