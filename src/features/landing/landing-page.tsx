"use client";

import { LogoLockup, LogoMark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getLocalizedModules,
  getLocalizedRecentSessions,
} from "@/features/dashboard/dashboard-view-model";
import { LanguageToggle } from "@/features/i18n/language-toggle";
import { useI18n } from "@/i18n/provider";
import {
  ArrowRight,
  BrainCircuit,
  ChartNoAxesColumn,
  CheckCircle2,
  Clock3,
  Gauge,
  Layers3,
  LockKeyhole,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const sectionMotion = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
};

export function LandingPage() {
  const { messages, t } = useI18n();
  const landing = messages.landing;
  const dashboard = messages.dashboard;
  const common = messages.common;

  const previewModules = getLocalizedModules(messages).slice(0, 3);
  const previewReviews = dashboard.reviewQueue;
  const sessions = getLocalizedRecentSessions(messages);
  const featuredPlans = landing.pricing.plans.map((plan, index) => ({
    ...plan,
    featured: index === 1,
    isFree: index === 0,
  }));

  return (
    <div className="relative overflow-x-clip">
      <LandingHeader />
      <main>
        <section className="relative isolate pb-20 pt-10 sm:pb-24 lg:pb-28 lg:pt-14">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(255,107,74,0.18),transparent_26%),radial-gradient(circle_at_70%_70%,rgba(34,197,94,0.12),transparent_28%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
            <motion.div {...sectionMotion} className="space-y-8">
              <Badge className="w-fit">
                <Sparkles className="size-3.5 text-cyan-600" />
                {landing.hero.badge}
              </Badge>

              <div className="space-y-6">
                <h1 className="font-display max-w-4xl text-5xl font-semibold leading-[0.95] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                  {landing.hero.titleLead}
                  <span className="block text-slate-500">
                    {landing.hero.titleAccent}
                  </span>
                </h1>

                <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                  {landing.hero.description}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/auth/signup">
                  <Button size="lg">
                    {common.actions.createWorkspace}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <a href="#product">
                  <Button size="lg" variant="secondary">
                    {common.actions.seeProduct}
                    <PlayCircle className="size-4" />
                  </Button>
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {landing.hero.stats.map((stat) => (
                  <Card
                    key={stat.label}
                    className="border-white/65 bg-white/72"
                  >
                    <CardContent className="space-y-2 pt-6">
                      <div className="font-display text-3xl font-semibold text-slate-950">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-slate-700">
                        {stat.label}
                      </div>
                      <p className="text-sm leading-6 text-slate-500">
                        {stat.detail}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            <motion.div
              {...sectionMotion}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.08,
              }}
              className="relative"
            >
              <div className="absolute -left-6 top-10 hidden h-40 w-40 rounded-full bg-cyan-400/30 blur-3xl lg:block" />
              <div className="absolute -bottom-6 right-0 hidden h-44 w-44 rounded-full bg-orange-400/25 blur-3xl lg:block" />
              <Card className="relative overflow-hidden border-white/70 bg-slate-950 text-white shadow-[0_40px_120px_-55px_rgba(15,23,32,0.9)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.2),transparent_38%),linear-gradient(135deg,rgba(14,165,233,0.1),transparent_40%)]" />
                <CardContent className="relative p-5 sm:p-6">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <LogoMark className="size-10 rounded-xl" />
                        <div>
                          <div className="text-sm font-medium text-white">
                            {landing.hero.dashboardLabel}
                          </div>
                          <div className="text-xs text-slate-400">
                            {landing.hero.dashboardSubLabel}
                          </div>
                        </div>
                      </div>
                      <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs text-emerald-200">
                        {landing.hero.nextReview}
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
                      <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {landing.hero.weaknessTitle}
                            </div>
                            <div className="text-xs text-slate-400">
                              {landing.hero.weaknessDescription}
                            </div>
                          </div>
                          <Gauge className="size-4 text-cyan-300" />
                        </div>

                        <div className="space-y-3">
                          {[
                            { key: "rendering", value: 86 },
                            { key: "effects", value: 61 },
                            { key: "typescript", value: 78 },
                            { key: "testing", value: 52 },
                          ].map((item) => (
                            <div key={item.key} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs text-slate-300">
                                <span>
                                  {
                                    dashboard.skillLabels[
                                      item.key as keyof typeof dashboard.skillLabels
                                    ]
                                  }
                                </span>
                                <span>{item.value}%</span>
                              </div>
                              <Progress
                                value={item.value}
                                className="bg-white/8"
                                indicatorClassName="bg-[linear-gradient(90deg,#22d3ee_0%,#60a5fa_55%,#f97316_100%)]"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="text-sm font-medium text-white">
                              {landing.hero.sessionPulseTitle}
                            </div>
                            <div className="text-xs text-slate-400">
                              {landing.hero.sessionPulseRange}
                            </div>
                          </div>
                          <div className="flex h-28 items-end gap-2">
                            {[48, 56, 53, 62, 72, 68, 81].map(
                              (height, index) => (
                                <div
                                  key={height}
                                  className="flex flex-1 flex-col items-center gap-2"
                                >
                                  <div
                                    className="w-full rounded-t-2xl bg-[linear-gradient(180deg,#67e8f9_0%,#0ea5e9_55%,#0f1720_100%)]"
                                    style={{ height: `${height}%` }}
                                  />
                                  <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                    {
                                      common.days[
                                        [
                                          "mon",
                                          "tue",
                                          "wed",
                                          "thu",
                                          "fri",
                                          "sat",
                                          "sun",
                                        ][index] as keyof typeof common.days
                                      ]
                                    }
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="text-sm font-medium text-white">
                              {landing.hero.misconceptionTitle}
                            </div>
                            <div className="text-xs text-orange-200">
                              {landing.hero.misconceptionPriority}
                            </div>
                          </div>
                          <p className="text-sm leading-6 text-slate-300">
                            {landing.hero.misconceptionPrompt}
                          </p>
                          <div className="mt-3 rounded-2xl bg-white/8 px-3 py-2 text-xs leading-5 text-slate-400">
                            {landing.hero.misconceptionExplanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="product" className="pb-20 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              {...sectionMotion}
              className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
            >
              <Card className="bg-slate-950 text-white">
                <CardHeader>
                  <Badge className="w-fit border-white/15 bg-white/8 text-slate-200">
                    {landing.product.principleBadge}
                  </Badge>
                  <CardTitle className="text-3xl text-white">
                    {landing.product.principleTitle}
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    {landing.product.principleDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {landing.product.loops.map((loop, index) => (
                    <div
                      key={loop.title}
                      className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-2 flex items-center gap-3">
                        <div className="font-display flex size-9 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-cyan-200">
                          0{index + 1}
                        </div>
                        <div className="text-base font-medium text-white">
                          {loop.title}
                        </div>
                      </div>
                      <p className="text-sm leading-6 text-slate-300">
                        {loop.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-6 sm:grid-cols-2">
                {landing.product.pillars.map((pillar, index) => {
                  const Icon =
                    index === 0
                      ? BrainCircuit
                      : index === 1
                        ? ChartNoAxesColumn
                        : Target;

                  return (
                    <Card key={pillar.title} className="h-full">
                      <CardHeader>
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-950 text-cyan-300">
                          <Icon className="size-5" />
                        </div>
                        <CardTitle>{pillar.title}</CardTitle>
                        <CardDescription>{pillar.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}

                <Card className="sm:col-span-2">
                  <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <CardTitle>{landing.product.experienceTitle}</CardTitle>
                      <CardDescription>
                        {landing.product.experienceDescription}
                      </CardDescription>
                    </div>
                    <Badge className="w-fit">
                      <CheckCircle2 className="size-3.5 text-emerald-600" />
                      {landing.product.experienceBadge}
                    </Badge>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-3">
                    {landing.product.experienceItems.map((item) => {
                      const Icon =
                        item.title === landing.product.experienceItems[0]?.title
                          ? Gauge
                          : item.title ===
                              landing.product.experienceItems[1]?.title
                            ? Clock3
                            : LockKeyhole;

                      return (
                        <div
                          key={item.title}
                          className="rounded-[24px] bg-slate-100/80 p-4"
                        >
                          <Icon className="mb-3 size-5 text-slate-950" />
                          <div className="font-medium text-slate-950">
                            {item.title}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.text}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="tracks" className="pb-20 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...sectionMotion} className="space-y-8">
              <div className="max-w-2xl space-y-4">
                <Badge className="w-fit">
                  <Layers3 className="size-3.5 text-cyan-600" />
                  {landing.tracks.badge}
                </Badge>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {landing.tracks.title}
                </h2>
                <p className="text-lg leading-8 text-slate-600">
                  {landing.tracks.description}
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {landing.tracks.items.map((track, index) => (
                  <Card key={track.title} className="relative overflow-hidden">
                    <div
                      className="absolute inset-x-0 top-0 h-1.5"
                      style={{
                        background:
                          index % 2 === 0
                            ? "linear-gradient(90deg, #0ea5e9, #22d3ee)"
                            : "linear-gradient(90deg, #ff6b4a, #f59e0b)",
                      }}
                    />
                    <CardHeader>
                      <div className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                        {track.eyebrow}
                      </div>
                      <CardTitle>{track.title}</CardTitle>
                      <CardDescription>{track.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {track.highlights.map((highlight) => (
                        <Badge
                          key={highlight}
                          className="border-slate-200 bg-slate-100 text-slate-700"
                        >
                          {highlight}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{landing.tracks.liveModuleTitle}</CardTitle>
                    <CardDescription>
                      {landing.tracks.liveModuleDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {previewModules.map((module) => (
                      <div
                        key={module.id}
                        className="rounded-[24px] border border-slate-200/80 bg-slate-50/70 p-4"
                      >
                        <div className="mb-3 flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm text-slate-500">
                              {module.track}
                            </div>
                            <div className="font-display text-xl font-semibold text-slate-950">
                              {module.title}
                            </div>
                          </div>
                          <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
                            {
                              common.levels[
                                module.level as keyof typeof common.levels
                              ]
                            }
                          </div>
                        </div>
                        <p className="mb-4 text-sm leading-6 text-slate-600">
                          {module.summary}
                        </p>
                        <Progress value={module.completion} />
                        <div className="mt-3 flex flex-wrap gap-2">
                          {module.focus.map((focus) => (
                            <Badge
                              key={focus}
                              className="border-white bg-white text-slate-600"
                            >
                              {focus}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{landing.tracks.reviewTitle}</CardTitle>
                    <CardDescription>
                      {landing.tracks.reviewDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {previewReviews.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-[24px] border border-slate-200/80 bg-white p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <Badge className="border-orange-200 bg-orange-50 text-orange-700">
                            {item.urgency}
                          </Badge>
                          <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                            {item.skill}
                          </div>
                        </div>
                        <div className="font-medium text-slate-950">
                          {item.title}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="pb-20 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              {...sectionMotion}
              className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
            >
              <Card className="bg-[linear-gradient(145deg,#0f1720_0%,#122131_52%,#10283b_100%)] text-white">
                <CardHeader>
                  <Badge className="w-fit border-white/15 bg-white/8 text-slate-200">
                    <Sparkles className="size-3.5 text-cyan-300" />
                    {landing.trainingFlow.mockBadge}
                  </Badge>
                  <CardTitle className="text-3xl text-white">
                    {landing.trainingFlow.mockTitle}
                  </CardTitle>
                  <CardDescription className="text-slate-300">
                    {landing.trainingFlow.mockDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <div className="font-medium text-white">
                          {session.title}
                        </div>
                        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-cyan-200">
                          {session.score}%
                        </div>
                      </div>
                      <div className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                        {session.duration}
                      </div>
                      <p className="text-sm leading-6 text-slate-300">
                        {session.summary}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{landing.trainingFlow.templatesTitle}</CardTitle>
                    <CardDescription>
                      {landing.trainingFlow.templatesDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dashboard.mockTemplates.map((template) => (
                      <div
                        key={template.title}
                        className="flex items-center justify-between rounded-[22px] border border-slate-200/80 bg-slate-50/70 px-4 py-3"
                      >
                        <div>
                          <div className="font-medium text-slate-950">
                            {template.title}
                          </div>
                          <div className="text-sm text-slate-500">
                            {template.composition}
                          </div>
                        </div>
                        <Target className="size-4 text-slate-400" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{landing.trainingFlow.premiumTitle}</CardTitle>
                    <CardDescription>
                      {landing.trainingFlow.premiumDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm leading-6 text-slate-600 sm:grid-cols-2">
                    {landing.trainingFlow.premiumItems.map((item) => (
                      <div
                        key={item}
                        className="rounded-[22px] border border-slate-200/80 bg-white px-4 py-3"
                      >
                        {item}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="pricing" className="pb-20 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...sectionMotion} className="space-y-8">
              <div className="max-w-2xl space-y-4">
                <Badge className="w-fit">
                  <ChartNoAxesColumn className="size-3.5 text-cyan-600" />
                  {landing.pricing.badge}
                </Badge>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {landing.pricing.title}
                </h2>
                <p className="text-lg leading-8 text-slate-600">
                  {landing.pricing.description}
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {featuredPlans.map((plan) => (
                  <Card
                    key={plan.title}
                    className={
                      plan.featured
                        ? "relative overflow-hidden border-slate-950 bg-slate-950 text-white"
                        : undefined
                    }
                  >
                    {plan.featured ? (
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#22d3ee_0%,#0ea5e9_48%,#ff6b4a_100%)]" />
                    ) : null}
                    <CardHeader>
                      <div
                        className={
                          plan.featured
                            ? "text-xs font-medium uppercase tracking-[0.24em] text-cyan-200"
                            : "text-xs font-medium uppercase tracking-[0.24em] text-slate-500"
                        }
                      >
                        {plan.title}
                      </div>
                      <CardTitle
                        className={
                          plan.featured ? "text-white" : "text-slate-950"
                        }
                      >
                        {plan.price}
                        {plan.isFree ? null : (
                          <span className="text-base">
                            {landing.pricing.monthlySuffix}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription
                        className={plan.featured ? "text-slate-300" : undefined}
                      >
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className={
                            plan.featured
                              ? "rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                              : "rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                          }
                        >
                          {feature}
                        </div>
                      ))}
                      <div className="pt-4">
                        <Link href="/auth/signup">
                          <Button
                            variant={plan.featured ? "secondary" : "primary"}
                            className="w-full"
                          >
                            {t("landing.pricing.choosePlan", {
                              plan: plan.title,
                            })}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...sectionMotion}>
              <Card className="overflow-hidden bg-[linear-gradient(130deg,#0f1720_0%,#0d2536_52%,#112a3d_100%)] text-white">
                <CardContent className="relative px-6 py-10 sm:px-10 sm:py-12">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.16),transparent_26%),radial-gradient(circle_at_90%_10%,rgba(255,107,74,0.14),transparent_20%)]" />
                  <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="space-y-4">
                      <Badge className="w-fit border-white/15 bg-white/8 text-slate-200">
                        <Sparkles className="size-3.5 text-cyan-300" />
                        {landing.final.badge}
                      </Badge>
                      <h2 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                        {landing.final.title}
                      </h2>
                      <p className="max-w-2xl text-lg leading-8 text-slate-300">
                        {landing.final.description}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Link href="/auth/signup">
                        <Button size="lg">
                          {common.actions.createWorkspace}
                          <ArrowRight className="size-4" />
                        </Button>
                      </Link>
                      <Link href="/auth/signin">
                        <Button size="lg" variant="secondary">
                          {common.actions.alreadyHaveAccount}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

function LandingHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-[rgba(246,239,230,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <LogoLockup compact tagline={t("common.brandTagline")} />
        <nav className="hidden items-center gap-8 text-sm text-slate-600 lg:flex">
          <Link href="/learn" className="hover:text-slate-950">
            {t("landing.nav.learn")}
          </Link>
          <a href="#tracks" className="hover:text-slate-950">
            {t("landing.nav.tracks")}
          </a>
          <a href="#product" className="hover:text-slate-950">
            {t("landing.nav.product")}
          </a>
          <a href="#pricing" className="hover:text-slate-950">
            {t("landing.nav.pricing")}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link href="/auth/signin">
            <Button variant="ghost" className="hidden sm:inline-flex">
              {t("common.actions.logIn")}
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button>
              {t("common.actions.startTraining")}
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
