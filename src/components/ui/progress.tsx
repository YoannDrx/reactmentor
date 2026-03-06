import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  indicatorClassName,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  return (
    <div
      className={cn(
        "h-2 overflow-hidden rounded-full bg-slate-200/80",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-[linear-gradient(90deg,#0ea5e9_0%,#22d3ee_55%,#22c55e_100%)] transition-[width] duration-300",
          indicatorClassName,
        )}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
