import "dotenv/config";
import Stripe from "stripe";
import {
  STRIPE_PRODUCT_TAX_CODE,
  premiumBillingPlanOrder,
  stripePremiumPlanCatalog,
} from "@/features/billing/stripe-plan-catalog";
import { SiteConfig } from "@/site-config";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const deactivateOldPrices = args.has("--deactivate-old-prices");

const stripeKey = process.env.STRIPE_SECRET_KEY;

if (!stripeKey) {
  console.error("STRIPE_SECRET_KEY environment variable is not set");
  process.exit(1);
}

const stripe = new Stripe(stripeKey, {
  typescript: true,
});

const appMetadata = {
  app: "reactmentor",
} as const;

const logoUrl = new URL(SiteConfig.logoPath, SiteConfig.prodUrl).toString();

async function listAllProducts() {
  const products: Stripe.Product[] = [];

  for await (const product of stripe.products.list({
    limit: 100,
  })) {
    products.push(product);
  }

  return products;
}

async function listProductPrices(productId: string) {
  const prices: Stripe.Price[] = [];

  for await (const price of stripe.prices.list({
    product: productId,
    limit: 100,
  })) {
    prices.push(price);
  }

  return prices;
}

async function ensureProduct(plan: (typeof premiumBillingPlanOrder)[number]) {
  const definition = stripePremiumPlanCatalog[plan];
  const products = await listAllProducts();
  const existingProduct =
    products.find(
      (product) =>
        product.metadata.app === appMetadata.app &&
        product.metadata.plan === definition.metadataPlan,
    ) ?? null;

  if (!existingProduct) {
    if (dryRun) {
      return {
        product: null,
        created: true,
      } as const;
    }

    const product = await stripe.products.create({
      name: definition.productName,
      description: definition.productDescription,
      tax_code: STRIPE_PRODUCT_TAX_CODE,
      images: [logoUrl],
      metadata: {
        ...appMetadata,
        plan: definition.metadataPlan,
      },
    });

    return {
      product,
      created: true,
    } as const;
  }

  const needsUpdate =
    existingProduct.name !== definition.productName ||
    existingProduct.description !== definition.productDescription ||
    existingProduct.tax_code !== STRIPE_PRODUCT_TAX_CODE ||
    existingProduct.images[0] !== logoUrl ||
    existingProduct.metadata.app !== appMetadata.app ||
    existingProduct.metadata.plan !== definition.metadataPlan;

  if (!needsUpdate || dryRun) {
    return {
      product: existingProduct,
      created: false,
    } as const;
  }

  const product = await stripe.products.update(existingProduct.id, {
    name: definition.productName,
    description: definition.productDescription,
    tax_code: STRIPE_PRODUCT_TAX_CODE,
    images: [logoUrl],
    metadata: {
      ...appMetadata,
      plan: definition.metadataPlan,
    },
  });

  return {
    product,
    created: false,
  } as const;
}

function isMatchingMonthlyPrice(
  price: Stripe.Price,
  plan: (typeof premiumBillingPlanOrder)[number],
) {
  const definition = stripePremiumPlanCatalog[plan];

  return (
    price.active &&
    price.currency === definition.currency &&
    price.unit_amount === definition.monthlyPriceCents &&
    price.recurring?.interval === "month" &&
    price.metadata.app === appMetadata.app &&
    price.metadata.plan === definition.metadataPlan &&
    price.metadata.billing === "monthly"
  );
}

async function ensureMonthlyPrice(params: {
  plan: (typeof premiumBillingPlanOrder)[number];
  productId: string;
}) {
  const definition = stripePremiumPlanCatalog[params.plan];
  const prices = await listProductPrices(params.productId);
  const matchingPrice = prices.find((price) =>
    isMatchingMonthlyPrice(price, params.plan),
  );

  let price = matchingPrice ?? null;
  let created = false;

  if (!matchingPrice && !dryRun) {
    price = await stripe.prices.create({
      product: params.productId,
      currency: definition.currency,
      unit_amount: definition.monthlyPriceCents,
      recurring: {
        interval: "month",
      },
      metadata: {
        ...appMetadata,
        plan: definition.metadataPlan,
        billing: "monthly",
      },
    });
    created = true;
  }

  if (deactivateOldPrices && !dryRun) {
    const staleActivePrices = prices.filter(
      (candidate) =>
        candidate.id !== price?.id &&
        candidate.active &&
        candidate.recurring?.interval === "month",
    );

    await Promise.all(
      staleActivePrices.map((candidate) =>
        stripe.prices.update(candidate.id, {
          active: false,
        }),
      ),
    );
  }

  return {
    price,
    created,
  } as const;
}

async function run() {
  const results: Array<{
    plan: (typeof premiumBillingPlanOrder)[number];
    productId: string | null;
    priceId: string | null;
    productCreated: boolean;
    priceCreated: boolean;
  }> = [];

  for (const plan of premiumBillingPlanOrder) {
    const ensuredProduct = await ensureProduct(plan);
    const ensuredPrice =
      ensuredProduct.product === null
        ? {
            price: null,
            created: true,
          }
        : await ensureMonthlyPrice({
            plan,
            productId: ensuredProduct.product.id,
          });

    results.push({
      plan,
      productId: ensuredProduct.product?.id ?? null,
      priceId: ensuredPrice.price?.id ?? null,
      productCreated: ensuredProduct.created,
      priceCreated: ensuredPrice.created,
    });
  }

  for (const result of results) {
    const definition = stripePremiumPlanCatalog[result.plan];
    console.log(
      `[${result.plan}] product=${result.productId ?? "dry_run"} price=${result.priceId ?? "dry_run"} productCreated=${result.productCreated} priceCreated=${result.priceCreated}`,
    );
    console.log(`${definition.envKey}=${result.priceId ?? ""}`);
  }
}

void run().catch((error) => {
  console.error(error);
  process.exit(1);
});
