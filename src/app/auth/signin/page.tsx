import { LogoLockup } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProviderButtons } from "@/features/auth/provider-buttons";
import { SignInForm } from "@/features/auth/sign-in-form";
import { getI18n } from "@/i18n/server";
import { configuredSocialProviders } from "@/lib/auth";
import { redirectIfAuthenticated } from "@/lib/auth/auth-user";
import { sanitizeCallbackUrl } from "@/lib/auth/auth-utils";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  await redirectIfAuthenticated("/dashboard");
  const { callbackUrl } = await searchParams;
  const safeCallbackUrl = sanitizeCallbackUrl(callbackUrl);
  const { messages } = await getI18n();
  const auth = messages.auth;

  return (
    <Card className="border-white/75 bg-white/84">
      <CardHeader className="space-y-4">
        <LogoLockup compact tagline={messages.common.brandTagline} />
        <Badge className="w-fit">
          <CheckCircle2 className="size-3.5 text-emerald-600" />
          {auth.signIn.badge}
        </Badge>
        <CardTitle>{auth.signIn.title}</CardTitle>
        <CardDescription>{auth.signIn.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SignInForm callbackUrl={safeCallbackUrl} />
        <ProviderButtons
          providers={configuredSocialProviders}
          callbackUrl={safeCallbackUrl}
        />
        <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
          {auth.signIn.helper}
        </div>
        <Link
          href={`/auth/signup?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700"
        >
          {auth.signIn.footer}
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
