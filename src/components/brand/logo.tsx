import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex size-12 items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/18 bg-[linear-gradient(145deg,#04131d_0%,#092433_52%,#103549_100%)] shadow-[0_22px_60px_-24px_rgba(2,132,199,0.75)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="size-full"
        fill="none"
      >
        <defs>
          <linearGradient id="rm-orbit" x1="10" y1="10" x2="54" y2="56">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="48%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#FF8A66" />
          </linearGradient>
          <linearGradient id="rm-core" x1="20" y1="18" x2="44" y2="46">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#BAE6FD" />
          </linearGradient>
        </defs>

        <rect
          x="1"
          y="1"
          width="62"
          height="62"
          rx="18"
          stroke="rgba(255,255,255,0.12)"
        />

        <path
          d="M15 41.5C15 27.7 25.8 17 39.6 17c3.2 0 6.1.6 8.8 1.8"
          stroke="url(#rm-orbit)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M49 22.2c0 13.8-10.9 24.8-24.7 24.8-3.3 0-6.4-.7-9.1-1.9"
          stroke="url(#rm-orbit)"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.92"
        />

        <path
          d="M22.5 24.5 16.5 32l6 7.5"
          stroke="#F8FAFC"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />
        <path
          d="M41.5 24.5 47.5 32l-6 7.5"
          stroke="#F8FAFC"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />

        <path
          d="M33.8 19.5 29.3 44"
          stroke="url(#rm-orbit)"
          strokeWidth="3.1"
          strokeLinecap="round"
        />

        <circle cx="31.8" cy="32" r="6.8" fill="url(#rm-core)" />
        <circle cx="31.8" cy="32" r="2.2" fill="#0F1720" opacity="0.9" />
        <circle cx="48.3" cy="20.2" r="2.6" fill="#67E8F9" />
        <circle cx="14.6" cy="44.8" r="2.2" fill="#FF8A66" />
      </svg>
    </div>
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
