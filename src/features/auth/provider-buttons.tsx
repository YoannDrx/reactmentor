"use client";

import { LogoMark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { sanitizeCallbackUrl } from "@/lib/auth/auth-utils";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { Chrome, Github, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const PROVIDER_META = {
  github: {
    icon: Github,
    className: "bg-slate-950 text-white hover:bg-slate-900",
  },
  google: {
    icon: Chrome,
    className: "bg-white text-slate-950 ring-1 ring-slate-200 hover:bg-slate-50",
  },
} as const;

export function ProviderButtons({
  providers,
  callbackUrl,
}: {
  providers: Array<"github" | "google">;
  callbackUrl?: string;
}) {
  const { messages } = useI18n();
  const safeCallbackUrl = sanitizeCallbackUrl(callbackUrl);
  const [pendingProvider, setPendingProvider] = useState<string | null>(null);
  const auth = messages.auth;

  const labels = {
    github: auth.social.continueWithGithub,
    google: auth.social.continueWithGoogle,
  } as const;

  if (providers.length === 0) {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 p-4">
        <div className="flex items-start gap-3">
          <LogoMark className="size-10 rounded-xl" />
          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-950">
              {auth.social.readyTitle}
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {auth.social.readyDescription}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {providers.map((provider) => {
        const meta = PROVIDER_META[provider];

        return (
          <Button
            key={provider}
            type="button"
            variant="secondary"
            className={cn("w-full justify-center", meta.className)}
            onClick={async () => {
              try {
                setPendingProvider(provider);
                const result = await authClient.signIn.social({
                  provider,
                  callbackURL: safeCallbackUrl,
                });

                if (result?.error) {
                  toast.error(result.error.message ?? auth.toasts.socialError);
                }
              } catch (error) {
                toast.error(
                  error instanceof Error ? error.message : auth.toasts.socialError,
                );
              } finally {
                setPendingProvider(null);
              }
            }}
          >
            {pendingProvider === provider ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <meta.icon className="size-4" />
            )}
            {labels[provider]}
          </Button>
        );
      })}

      <div className="flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-slate-200" />
        <Badge className="border-slate-200 bg-white text-slate-500">
          {auth.social.or}
        </Badge>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Link
        href={`/auth/signup?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`}
        className={buttonVariants({ variant: "ghost", size: "md" })}
      >
        {auth.actions.createInstead}
      </Link>
    </div>
  );
}
