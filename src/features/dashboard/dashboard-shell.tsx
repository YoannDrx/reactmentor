"use client";

import { QuestionLevel, Track } from "@prisma/client";
import { LogoMark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { LanguageToggle } from "@/features/i18n/language-toggle";
import type { DashboardRecommendation } from "@/features/dashboard/dashboard-recommendation-contract";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import {
  BookOpenCheck,
  Bookmark,
  ChevronLeft,
  NotebookText,
  Gauge,
  LayoutDashboard,
  Menu,
  Settings,
  Sparkles,
  Target,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationIcons = {
  overview: LayoutDashboard,
  modules: BookOpenCheck,
  bookmarks: Bookmark,
  notes: NotebookText,
  progress: Gauge,
  mockInterviews: Target,
  review: Sparkles,
  settings: Settings,
} as const;

export function DashboardShell({
  children,
  user,
  sidebarSnapshot,
}: {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
  };
  sidebarSnapshot: {
    dueReviews: number;
    readiness: number;
    targetRole: string;
    targetLevel: QuestionLevel;
    primaryTrack: Track;
    recommendation: DashboardRecommendation;
  };
}) {
  const pathname = usePathname();
  const { messages, t } = useI18n();
  const sidebar = messages.dashboard.sidebar;
  const pages = messages.dashboard.pages;
  const levelLabels: Record<QuestionLevel, string> = {
    [QuestionLevel.JUNIOR]: messages.common.levels.junior,
    [QuestionLevel.MID]: messages.common.levels.mid,
    [QuestionLevel.SENIOR]: messages.common.levels.senior,
  };
  const activeTargetValue = sidebarSnapshot.targetRole.trim()
    ? `${sidebarSnapshot.targetRole} · ${messages.dashboard.trackLabels[sidebarSnapshot.primaryTrack]} / ${levelLabels[sidebarSnapshot.targetLevel]}`
    : `${messages.dashboard.trackLabels[sidebarSnapshot.primaryTrack]} / ${levelLabels[sidebarSnapshot.targetLevel]}`;
  const navigation = [
    {
      href: "/dashboard",
      icon: navigationIcons.overview,
      ...sidebar.nav.overview,
    },
    {
      href: "/dashboard/modules",
      icon: navigationIcons.modules,
      ...sidebar.nav.modules,
    },
    {
      href: "/dashboard/bookmarks",
      icon: navigationIcons.bookmarks,
      ...sidebar.nav.bookmarks,
    },
    {
      href: "/dashboard/notes",
      icon: navigationIcons.notes,
      ...sidebar.nav.notes,
    },
    {
      href: "/dashboard/progress",
      icon: navigationIcons.progress,
      ...sidebar.nav.progress,
    },
    {
      href: "/dashboard/mock-interviews",
      icon: navigationIcons.mockInterviews,
      ...sidebar.nav.mockInterviews,
    },
    {
      href: "/dashboard/review",
      icon: navigationIcons.review,
      ...sidebar.nav.review,
    },
    {
      href: "/dashboard/settings",
      icon: navigationIcons.settings,
      ...sidebar.nav.settings,
    },
  ] as const;
  const pageMeta = {
    "/dashboard": pages.overview,
    "/dashboard/modules": pages.modules,
    "/dashboard/bookmarks": pages.bookmarks,
    "/dashboard/notes": pages.notes,
    "/dashboard/progress": pages.progress,
    "/dashboard/mock-interviews": pages.mockInterviews,
    "/dashboard/review": pages.review,
    "/dashboard/session": pages.session,
    "/dashboard/settings": pages.settings,
  } as const;
  const currentMeta =
    pathname.startsWith("/dashboard/modules/")
      ? pageMeta["/dashboard/modules"]
      : pathname.startsWith("/dashboard/session/")
        ? pageMeta["/dashboard/session"]
      : pageMeta[pathname as keyof typeof pageMeta] ?? pageMeta["/dashboard"];
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("react-mentor.sidebar") === "collapsed";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const todayFocusText =
    sidebarSnapshot.recommendation.kind === "review"
      ? t("dashboard.sidebar.todayFocusReview", {
          count: sidebarSnapshot.recommendation.dueCount,
        })
      : sidebarSnapshot.recommendation.kind === "module"
        ? t(
            `dashboard.sidebar.todayFocusModule.${sidebarSnapshot.recommendation.reason}`,
            {
              module: sidebarSnapshot.recommendation.moduleTitle,
            },
          )
        : sidebar.todayFocusFallback;

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    window.localStorage.setItem(
      "react-mentor.sidebar",
      next ? "collapsed" : "expanded",
    );
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_28%),linear-gradient(180deg,#fbf7f0_0%,#f5ede3_40%,#efe5d9_100%)]">
      {mobileOpen ? (
        <button
          type="button"
          aria-label={messages.common.a11y.closeSidebar}
          className="fixed inset-0 z-30 bg-slate-950/45 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="lg:flex">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-sidebar text-sidebar-foreground shadow-[30px_0_90px_-55px_rgba(15,23,32,0.85)] transition-transform duration-300 lg:translate-x-0",
            collapsed ? "w-24" : "w-80",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-5">
            <div className="flex items-center gap-3 overflow-hidden">
              <LogoMark className="size-11 shrink-0 rounded-2xl" />
              <div className={cn("min-w-0", collapsed && "hidden")}>
                <div className="font-display text-lg font-semibold text-white">
                  React Mentor
                </div>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {sidebar.appLabel}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="hidden rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 lg:inline-flex"
              onClick={toggleCollapsed}
              aria-label={messages.common.a11y.toggleSidebar}
            >
              <ChevronLeft
                className={cn(
                  "size-4 transition-transform",
                  collapsed && "rotate-180",
                )}
              />
            </button>
            <button
              type="button"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label={messages.common.a11y.closeMobileSidebar}
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="px-4">
            <div
              className={cn(
                "rounded-[26px] border border-white/10 bg-white/5 p-4",
                collapsed && "px-3",
              )}
            >
              <div className={cn("space-y-1", collapsed && "hidden")}>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {sidebar.todayFocusLabel}
                </div>
                <div className="text-sm leading-6 text-slate-200">
                  {todayFocusText}
                </div>
              </div>
              <div className={cn("mt-3", collapsed && "mt-0")}>
                <Badge className="w-fit border-cyan-400/20 bg-cyan-400/10 text-cyan-100">
                  {t("dashboard.sidebar.dueReviews", {
                    count: sidebarSnapshot.dueReviews,
                  })}
                </Badge>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-[24px] px-4 py-3 text-sm transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_18px_40px_-26px_rgba(103,232,249,0.75)]"
                      : "text-slate-300 hover:bg-sidebar-accent hover:text-white",
                    collapsed && "justify-center px-0",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="size-5 shrink-0" />
                  <div className={cn("min-w-0", collapsed && "hidden")}>
                    <div className="font-medium">{item.label}</div>
                    <div
                      className={cn(
                        "text-xs",
                        isActive ? "text-slate-800/70" : "text-slate-500",
                      )}
                    >
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-white/8 px-4 py-4">
            <div
              className={cn(
                "rounded-[24px] border border-white/10 bg-white/5 p-4",
                collapsed && "p-3",
              )}
            >
              <div className={cn("space-y-1", collapsed && "hidden")}>
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {sidebar.activeTargetLabel}
                </div>
                <div className="text-sm text-white">{activeTargetValue}</div>
              </div>
              <Badge className="mt-3 w-fit border-emerald-400/20 bg-emerald-400/10 text-emerald-100">
                {t("dashboard.sidebar.readiness", {
                  value: sidebarSnapshot.readiness,
                })}
              </Badge>
            </div>

            <div
              className={cn(
                "flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-3",
                collapsed && "justify-center px-0",
              )}
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                <UserRound className="size-5" />
              </div>
              <div className={cn("min-w-0", collapsed && "hidden")}>
                <div className="truncate font-medium text-white">{user.name}</div>
                <div className="truncate text-sm text-slate-400">{user.email}</div>
              </div>
            </div>
          </div>
        </aside>

        <div
          className={cn(
            "flex min-h-screen flex-1 flex-col",
            collapsed ? "lg:pl-24" : "lg:pl-80",
          )}
        >
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[rgba(251,247,240,0.82)] backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="inline-flex rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label={messages.common.a11y.openSidebar}
                >
                  <Menu className="size-4" />
                </button>
                <div>
                  <div className="font-display text-2xl font-semibold tracking-tight text-slate-950">
                    {currentMeta.title}
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    {currentMeta.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <LanguageToggle />
                <Link
                  href="/dashboard/review"
                  className={cn(
                    buttonVariants({ variant: "primary", size: "md" }),
                    "hidden lg:inline-flex",
                  )}
                >
                  {messages.common.actions.openReviewQueue}
                </Link>
              </div>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
