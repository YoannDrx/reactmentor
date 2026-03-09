import { BillingPlan } from "@prisma/client";

export const STRIPE_PRODUCT_TAX_CODE = "txcd_10701200";

export const premiumBillingPlanOrder = [
  BillingPlan.MENTOR_PRO,
  BillingPlan.HIRING_SPRINT,
] as const;

export type PremiumBillingPlan = (typeof premiumBillingPlanOrder)[number];

type StripePriceEnvKey =
  | "STRIPE_PRICE_MENTOR_PRO"
  | "STRIPE_PRICE_HIRING_SPRINT";

export type StripePremiumPlanDefinition = {
  plan: PremiumBillingPlan;
  envKey: StripePriceEnvKey;
  productName: string;
  productDescription: string;
  monthlyPriceCents: number;
  currency: "eur";
  metadataPlan: string;
};

export const stripePremiumPlanCatalog = {
  [BillingPlan.MENTOR_PRO]: {
    plan: BillingPlan.MENTOR_PRO,
    envKey: "STRIPE_PRICE_MENTOR_PRO",
    productName: "React Mentor Pro",
    productDescription:
      "Preparation React complete : tous les modules publies, mocks chronometres illimites, analytics avancees et playlists ciblees.",
    monthlyPriceCents: 2400,
    currency: "eur",
    metadataPlan: "mentor_pro",
  },
  [BillingPlan.HIRING_SPRINT]: {
    plan: BillingPlan.HIRING_SPRINT,
    envKey: "STRIPE_PRICE_HIRING_SPRINT",
    productName: "React Mentor Hiring Sprint",
    productDescription:
      "Preparation intensive avant entretien : tout Mentor Pro, mode sprint active et surface premium la plus large pour un cycle de candidature court.",
    monthlyPriceCents: 5900,
    currency: "eur",
    metadataPlan: "hiring_sprint",
  },
} as const satisfies Record<PremiumBillingPlan, StripePremiumPlanDefinition>;
