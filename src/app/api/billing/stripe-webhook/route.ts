import {
  OperationalEventLevel,
  ProductAnalyticsEventName,
} from "@prisma/client";
import type Stripe from "stripe";
import { env } from "@/lib/env";
import { getStripeServerClient } from "@/lib/stripe";
import { revalidateBillingEntitlementPaths } from "@/features/billing/billing-revalidation";
import {
  isStripeWebhookConfigured,
  parsePremiumBillingPlan,
  syncUserEntitlementFromCheckoutSession,
  syncUserEntitlementFromStripeSubscription,
} from "@/features/billing/stripe-billing";
import {
  captureOperationalEvent,
  captureProductAnalyticsEvent,
  getErrorMessage,
  getErrorMetadata,
} from "@/features/telemetry/telemetry";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isStripeWebhookConfigured()) {
    await captureOperationalEvent({
      source: "billing.webhook",
      eventType: "configuration_missing",
      level: OperationalEventLevel.WARN,
      status: "unavailable",
    });

    return new Response("Stripe webhook is not configured.", {
      status: 503,
    });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature || !env.STRIPE_WEBHOOK_SECRET) {
    await captureOperationalEvent({
      source: "billing.webhook",
      eventType: "signature_missing",
      level: OperationalEventLevel.ERROR,
      status: "invalid_request",
    });

    return new Response("Missing Stripe signature.", {
      status: 400,
    });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripeServerClient().webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown webhook signature error.";

    await captureOperationalEvent({
      source: "billing.webhook",
      eventType: "signature_verification_failed",
      level: OperationalEventLevel.ERROR,
      status: "failed",
      message,
      metadata: getErrorMetadata(error),
    });

    return new Response(`Webhook Error: ${message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === "subscription") {
          await syncUserEntitlementFromCheckoutSession({
            checkoutSessionId: session.id,
            userId:
              typeof session.metadata?.userId === "string"
                ? session.metadata.userId
                : null,
          });

          await captureProductAnalyticsEvent({
            userId:
              typeof session.metadata?.userId === "string"
                ? session.metadata.userId
                : null,
            name: ProductAnalyticsEventName.CHECKOUT_COMPLETED,
            source: "billing.webhook",
            billingPlan: parsePremiumBillingPlan(session.metadata?.targetPlan),
            metadata: {
              stripeEventId: event.id,
              checkoutSessionId: session.id,
            },
          });
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await syncUserEntitlementFromStripeSubscription({
          subscription: event.data.object as Stripe.Subscription,
        });

        if (event.type === "customer.subscription.created") {
          const subscription = event.data.object as Stripe.Subscription;

          await captureProductAnalyticsEvent({
            userId:
              typeof subscription.metadata?.userId === "string"
                ? subscription.metadata.userId
                : null,
            name: ProductAnalyticsEventName.SUBSCRIPTION_STARTED,
            source: "billing.webhook",
            billingPlan: parsePremiumBillingPlan(subscription.metadata?.targetPlan),
            metadata: {
              stripeEventId: event.id,
              subscriptionId: subscription.id,
              status: subscription.status,
            },
          });
        }
        break;
      }
      default:
        break;
    }

    await captureOperationalEvent({
      source: "billing.webhook",
      eventType: event.type,
      level: OperationalEventLevel.INFO,
      status: "processed",
      metadata: {
        stripeEventId: event.id,
      },
    });

    revalidateBillingEntitlementPaths();
    return Response.json({ received: true });
  } catch (error) {
    const message = getErrorMessage(
      error,
      "Unknown webhook processing error.",
    );

    await captureOperationalEvent({
      source: "billing.webhook",
      eventType: event.type,
      level: OperationalEventLevel.ERROR,
      status: "failed",
      message,
      metadata: {
        stripeEventId: event.id,
        error: getErrorMetadata(error) ?? null,
      },
    });

    return new Response(`Webhook Handler Error: ${message}`, {
      status: 500,
    });
  }
}
