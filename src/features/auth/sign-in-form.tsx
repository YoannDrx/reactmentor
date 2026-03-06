"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/provider";
import { authClient } from "@/lib/auth-client";
import { sanitizeCallbackUrl } from "@/lib/auth/auth-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type SignInValues = {
  email: string;
  password: string;
};

export function SignInForm({ callbackUrl }: { callbackUrl?: string }) {
  const { messages } = useI18n();
  const auth = messages.auth;
  const safeCallbackUrl = sanitizeCallbackUrl(callbackUrl);
  const router = useRouter();
  const signInSchema = z.object({
    email: z.string().email(auth.errors.emailInvalid),
    password: z.string().min(8, auth.errors.passwordMin),
  });
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        try {
          const result = await authClient.signIn.email({
            email: values.email,
            password: values.password,
            rememberMe: true,
          });

          if (result?.error) {
            toast.error(result.error.message ?? auth.toasts.signInError);
            return;
          }

          toast.success(auth.toasts.welcomeBack);
          router.push(safeCallbackUrl);
          router.refresh();
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : auth.toasts.signInError,
          );
        }
      })}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          {auth.fields.email}
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={auth.placeholders.email}
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="password"
          >
            {auth.fields.password}
          </label>
          <Link
            href={`/auth/signup?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`}
            className="text-sm text-slate-500 underline"
          >
            {auth.actions.needAccount}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder={auth.placeholders.password}
          {...form.register("password")}
        />
        {form.formState.errors.password ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.password.message}
          </p>
        ) : null}
      </div>

      <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4" />
        )}
        {auth.actions.accessDashboard}
      </Button>
    </form>
  );
}
