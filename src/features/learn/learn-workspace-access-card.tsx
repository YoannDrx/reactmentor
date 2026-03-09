import { ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

type LearnWorkspaceAccessCardProps = {
  callbackUrl: string;
  title: string;
  description: string;
  highlights: readonly string[];
  signInLabel: string;
  createWorkspaceLabel: string;
};

export function LearnWorkspaceAccessCard({
  callbackUrl,
  title,
  description,
  highlights,
  signInLabel,
  createWorkspaceLabel,
}: LearnWorkspaceAccessCardProps) {
  const signInHref = `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  const signUpHref = `/auth/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className="rounded-[28px] border border-slate-950 bg-slate-950 p-6 text-white">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
        <ShieldCheck className="size-4" />
        Workspace
      </div>
      <div className="mt-4 space-y-3">
        <div className="text-2xl font-semibold">{title}</div>
        <p className="text-sm leading-7 text-slate-300">{description}</p>
      </div>
      <div className="mt-5 grid gap-3">
        {highlights.map((highlight) => (
          <div
            key={highlight}
            className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
          >
            {highlight}
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={signUpHref}>
          <Button>
            {createWorkspaceLabel}
            <ArrowRight className="size-4" />
          </Button>
        </Link>
        <Link href={signInHref} className={buttonVariants({ variant: "secondary", size: "md" })}>
          {signInLabel}
        </Link>
      </div>
    </div>
  );
}
