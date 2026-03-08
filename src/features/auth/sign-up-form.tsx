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

type SignUpValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignUpForm({ callbackUrl }: { callbackUrl?: string }) {
  const { locale, messages } = useI18n();
  const auth = messages.auth;
  const safeCallbackUrl = sanitizeCallbackUrl(callbackUrl);
  const router = useRouter();
  const signUpSchema = z
    .object({
      name: z.string().min(2, auth.errors.nameMin),
      email: z.string().email(auth.errors.emailInvalid),
      password: z.string().min(8, auth.errors.passwordMin),
      confirmPassword: z.string().min(8, auth.errors.confirmPasswordMin),
    })
    .refine((value) => value.password === value.confirmPassword, {
      message: auth.errors.passwordsMismatch,
      path: ["confirmPassword"],
    });
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        try {
          const result = await authClient.signUp.email({
            name: values.name,
            email: values.email,
            password: values.password,
          });

          if (result?.error) {
            toast.error(result.error.message ?? auth.toasts.signUpError);
            return;
          }

          toast.success(auth.toasts.workspaceCreated);
          await fetch("/api/analytics/client-events", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              name: "ACCOUNT_CREATED",
              source: "auth.signup.email",
              locale,
            }),
          }).catch(() => null);
          router.push(safeCallbackUrl);
          router.refresh();
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : auth.toasts.signUpError,
          );
        }
      })}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          {auth.fields.name}
        </label>
        <Input
          id="name"
          autoComplete="name"
          placeholder={auth.placeholders.name}
          {...form.register("name")}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-red-600">
            {form.formState.errors.name.message}
          </p>
        ) : null}
      </div>

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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="password"
          >
            {auth.fields.password}
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder={auth.placeholders.password}
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="confirmPassword"
          >
            {auth.fields.confirmPassword}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder={auth.placeholders.password}
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword ? (
            <p className="text-sm text-red-600">
              {form.formState.errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
        {auth.signUp.helper}
      </div>

      <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ArrowRight className="size-4" />
        )}
        {auth.actions.createAccount}
      </Button>

      <p className="text-center text-sm text-slate-500">
        {auth.signUp.footerLead}{" "}
        <Link
          href={`/auth/signin?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`}
          className="text-slate-950 underline"
        >
          {auth.signUp.footerAction}
        </Link>
      </p>
    </form>
  );
}
