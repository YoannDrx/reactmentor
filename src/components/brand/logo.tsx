import Image from "next/image";
import {
  BRAND_LOGO_ALT,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PATH,
  BRAND_LOGO_WIDTH,
} from "@/lib/brand";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-12 shrink-0", className)}>
      <Image
        src={BRAND_LOGO_PATH}
        alt={BRAND_LOGO_ALT}
        width={BRAND_LOGO_WIDTH}
        height={BRAND_LOGO_HEIGHT}
        sizes="(max-width: 640px) 40px, 48px"
        className="size-full object-contain"
      />
    </span>
  );
}

export function LogoLockup({
  className,
  compact = false,
  tagline,
  theme = "light",
}: {
  className?: string;
  compact?: boolean;
  tagline?: string;
  theme?: "light" | "dark";
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark className={compact ? "size-10 rounded-xl" : undefined} />
      <div className="space-y-0.5">
        <div
          className={cn(
            "font-display text-base font-semibold tracking-tight",
            theme === "dark" ? "text-white" : "text-slate-950",
          )}
        >
          React Mentor
        </div>
        {tagline ? (
          <div
            className={cn(
              "text-xs uppercase tracking-[0.18em]",
              theme === "dark" ? "text-slate-400" : "text-slate-500",
            )}
          >
            {tagline}
          </div>
        ) : null}
      </div>
    </div>
  );
}
