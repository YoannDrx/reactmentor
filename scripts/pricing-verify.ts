import "dotenv/config";
import Stripe from "stripe";
import {
  STRIPE_PRODUCT_TAX_CODE,
  premiumBillingPlanOrder,
  stripePremiumPlanCatalog,
} from "@/features/billing/stripe-plan-catalog";
import { SiteConfig } from "@/site-config";

type Severity = "error" | "warning" | "info";

type VerificationIssue = {
  severity: Severity;
  check: string;
  message: string;
};

const args = new Set(process.argv.slice(2));
const strictMode = args.has("--strict");
const outputJson = args.has("--json");
const skipStripe = args.has("--skip-stripe");

const issues: VerificationIssue[] = [];

const pushIssue = (severity: Severity, check: string, message: string) => {
  issues.push({
    severity,
    check,
    message,
  });
};

const formatSummary = () => {
  const errors = issues.filter((item) => item.severity === "error");
  const warnings = issues.filter((item) => item.severity === "warning");
  const infos = issues.filter((item) => item.severity === "info");

  return {
    errors: errors.length,
    warnings: warnings.length,
    infos: infos.length,
  };
};

const hasFailingStatus = () => {
  const summary = formatSummary();
  if (summary.errors > 0) return true;
  if (strictMode && summary.warnings > 0) return true;
  return false;
};

function getConfiguredPriceId(plan: (typeof premiumBillingPlanOrder)[number]) {
  const definition = stripePremiumPlanCatalog[plan];
  return process.env[definition.envKey] ?? "";
}

async function verifyStaticPlanDefinitions() {
  for (const plan of premiumBillingPlanOrder) {
    const definition = stripePremiumPlanCatalog[plan];
    const configuredPriceId = getConfiguredPriceId(plan);

    if (!configuredPriceId) {
      pushIssue(
        "error",
        "plans.static",
        `price id manquant pour ${plan} (${definition.envKey})`,
      );
    }

    if (definition.monthlyPriceCents <= 0) {
      pushIssue(
        "error",
        "plans.static",
        `monthlyPriceCents invalide pour ${plan}`,
      );
    }
  }

  pushIssue(
    "info",
    "plans.static",
    "Verification des definitions de plans Stripe terminee",
  );
}

async function verifyStripePrices() {
  if (skipStripe) {
    pushIssue(
      "info",
      "stripe.live",
      "Verification Stripe ignoree (--skip-stripe)",
    );
    return;
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey) {
    pushIssue(
      "warning",
      "stripe.live",
      "STRIPE_SECRET_KEY absent: verification Stripe ignoree",
    );
    return;
  }

  const stripe = new Stripe(stripeKey, {
    typescript: true,
  });
  const expectedLogoUrl = new URL(
    SiteConfig.logoPath,
    SiteConfig.prodUrl,
  ).toString();

  for (const plan of premiumBillingPlanOrder) {
    const definition = stripePremiumPlanCatalog[plan];
    const priceId = getConfiguredPriceId(plan);

    if (!priceId) {
      continue;
    }

    try {
      const price = await stripe.prices.retrieve(priceId);

      if (!price.active) {
        pushIssue(
          "warning",
          "stripe.live",
          `${plan}: price ${priceId} inactif`,
        );
      }

      if (price.unit_amount !== definition.monthlyPriceCents) {
        pushIssue(
          "error",
          "stripe.live",
          `${plan}: montant inattendu (${price.unit_amount} vs ${definition.monthlyPriceCents})`,
        );
      }

      if (price.currency !== definition.currency) {
        pushIssue(
          "error",
          "stripe.live",
          `${plan}: devise inattendue (${price.currency} vs ${definition.currency})`,
        );
      }

      if (price.recurring?.interval !== "month") {
        pushIssue(
          "error",
          "stripe.live",
          `${plan}: intervalle inattendu (${price.recurring?.interval ?? "none"} vs month)`,
        );
      }

      if (price.metadata.app !== "reactmentor") {
        pushIssue(
          "warning",
          "stripe.live",
          `${priceId}: metadata.app absent/invalide (${price.metadata.app || "absent"})`,
        );
      }

      if (price.metadata.plan !== definition.metadataPlan) {
        pushIssue(
          "warning",
          "stripe.live",
          `${priceId}: metadata.plan absent/invalide (${price.metadata.plan || "absent"})`,
        );
      }

      if (price.metadata.billing !== "monthly") {
        pushIssue(
          "warning",
          "stripe.live",
          `${priceId}: metadata.billing absent/invalide (${price.metadata.billing || "absent"})`,
        );
      }

      const productId =
        typeof price.product === "string" ? price.product : price.product.id;
      const product = await stripe.products.retrieve(productId);

      if (!product.active) {
        pushIssue(
          "warning",
          "stripe.live",
          `${plan}: produit ${product.id} inactif`,
        );
      }

      if (product.name !== definition.productName) {
        pushIssue(
          "error",
          "stripe.live",
          `${plan}: nom produit inattendu (${product.name} vs ${definition.productName})`,
        );
      }

      if (product.description !== definition.productDescription) {
        pushIssue(
          "warning",
          "stripe.live",
          `${plan}: description produit differente de la definition attendue`,
        );
      }

      if (product.tax_code !== STRIPE_PRODUCT_TAX_CODE) {
        pushIssue(
          "warning",
          "stripe.live",
          `${plan}: tax_code inattendu (${product.tax_code || "absent"})`,
        );
      }

      if (product.metadata.app !== "reactmentor") {
        pushIssue(
          "warning",
          "stripe.live",
          `${product.id}: metadata.app absent/invalide (${product.metadata.app || "absent"})`,
        );
      }

      if (product.metadata.plan !== definition.metadataPlan) {
        pushIssue(
          "warning",
          "stripe.live",
          `${product.id}: metadata.plan absent/invalide (${product.metadata.plan || "absent"})`,
        );
      }

      if (product.images[0] !== expectedLogoUrl) {
        pushIssue(
          "warning",
          "stripe.live",
          `${product.id}: image principale differente de ${expectedLogoUrl}`,
        );
      }
    } catch (error) {
      pushIssue(
        "error",
        "stripe.live",
        `${plan}: impossible de verifier ${priceId} (${error instanceof Error ? error.message : "unknown error"})`,
      );
    }
  }

  pushIssue("info", "stripe.live", "Verification Stripe terminee");
}

async function run() {
  await verifyStaticPlanDefinitions();
  await verifyStripePrices();

  const summary = formatSummary();

  if (outputJson) {
    console.log(
      JSON.stringify(
        {
          summary,
          strictMode,
          issues,
        },
        null,
        2,
      ),
    );
  } else {
    for (const issue of issues) {
      const prefix =
        issue.severity === "error"
          ? "ERROR"
          : issue.severity === "warning"
            ? "WARN"
            : "INFO";
      console.log(`[${prefix}] [${issue.check}] ${issue.message}`);
    }

    console.log(
      `pricing:verify summary -> errors=${summary.errors}, warnings=${summary.warnings}, infos=${summary.infos}, strict=${strictMode}`,
    );
  }

  process.exit(hasFailingStatus() ? 1 : 0);
}

void run();
