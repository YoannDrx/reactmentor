import { LogoLockup } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "@/features/auth/sign-up-form";
import { getI18n } from "@/i18n/server";
import { redirectIfAuthenticated } from "@/lib/auth/auth-user";
import { sanitizeCallbackUrl } from "@/lib/auth/auth-utils";
import { Sparkles } from "lucide-react";

export default async function SignUpPage({
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
          <Sparkles className="size-3.5 text-cyan-600" />
          {auth.signUp.badge}
        </Badge>
        <CardTitle>{auth.signUp.title}</CardTitle>
        <CardDescription>{auth.signUp.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm callbackUrl={safeCallbackUrl} />
      </CardContent>
    </Card>
  );
}
