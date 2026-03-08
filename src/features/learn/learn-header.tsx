import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoLockup } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

type LearnHeaderProps = {
  libraryLabel: string;
  signInLabel: string;
  createWorkspaceLabel: string;
  brandTagline: string;
};

export function LearnHeader({
  libraryLabel,
  signInLabel,
  createWorkspaceLabel,
  brandTagline,
}: LearnHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[rgba(246,239,230,0.86)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <LogoLockup compact tagline={brandTagline} />
          </Link>
          <Link
            href="/learn"
            className="hidden text-sm font-medium text-slate-600 hover:text-slate-950 sm:inline-flex"
          >
            {libraryLabel}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/auth/signin">
            <Button variant="ghost" className="hidden sm:inline-flex">
              {signInLabel}
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button>
              {createWorkspaceLabel}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
