import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  canAccessModuleSlug,
  getUserEntitlementSnapshot,
} from "@/features/billing/user-entitlements";
import { QuestionPreviewCard } from "@/features/learn/question-preview-card";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { getLocalizedModuleBySlug } from "@/lib/content-repository";
import {
  ArrowLeft,
  BookOpenCheck,
  Layers3,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DashboardModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getRequiredUser(`/dashboard/modules/${slug}`);
  const { locale, messages, t } = await getI18n();
  const [learningModule, entitlement, canAccessModule] = await Promise.all([
    getLocalizedModuleBySlug(slug, locale),
    getUserEntitlementSnapshot(user.id),
    canAccessModuleSlug({
      userId: user.id,
      moduleSlug: slug,
    }),
  ]);

  if (!learningModule) {
    notFound();
  }

  const detail = messages.dashboard.moduleDetail;
  const entitlements = messages.dashboard.entitlements;
  const common = messages.common;
  const learn = messages.learn;
  const trackLabel = messages.dashboard.trackLabels[learningModule.track];

  if (!canAccessModule) {
    return (
      <div className="grid gap-6">
        <div>
          <Link
            href="/dashboard/modules"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600"
          >
            <ArrowLeft className="size-4" />
            {detail.backToLibrary}
          </Link>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="border-slate-200 bg-slate-100 text-slate-700">
                  {trackLabel}
                </Badge>
                <Badge className="border-slate-200 bg-white text-slate-700">
                  {
                    common.levels[
                      learningModule.level.toLowerCase() as keyof typeof common.levels
                    ]
                  }
                </Badge>
                <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                  {entitlements.gates.modules.cardBadge}
                </Badge>
              </div>
              <div className="space-y-2">
                <CardTitle>{learningModule.title}</CardTitle>
                <CardDescription>{learningModule.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                {learningModule.summary ?? detail.summaryFallback}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-950">
                    <BookOpenCheck className="size-4 text-cyan-600" />
                    {detail.questionCountLabel}
                  </div>
                  <div className="font-display text-3xl font-semibold text-slate-950">
                    {learningModule.counts.questions}
                  </div>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-950">
                    <Layers3 className="size-4 text-cyan-600" />
                    {detail.skillCountLabel}
                  </div>
                  <div className="font-display text-3xl font-semibold text-slate-950">
                    {learningModule.counts.skills}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/80">
            <CardHeader>
              <Badge className="w-fit border-amber-200 bg-amber-100 text-amber-800">
                {entitlements.gates.modules.badge}
              </Badge>
              <CardTitle>{entitlements.gates.modules.title}</CardTitle>
              <CardDescription className="text-amber-950/80">
                {t("dashboard.entitlements.gates.modules.description", {
                  count: entitlement.moduleAccessLimit ?? 0,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-[22px] border border-amber-200 bg-white/80 p-4 text-sm leading-6 text-amber-950">
                {entitlements.gates.modules.previewNote}
              </div>
              <div className="text-sm text-amber-950/80">
                {entitlements.gates.modules.cardHint}
              </div>
              <Link
                href="/dashboard/settings"
                className={buttonVariants({ variant: "secondary", size: "md" })}
              >
                {entitlements.gates.modules.action}
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div>
        <Link
          href="/dashboard/modules"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600"
        >
          <ArrowLeft className="size-4" />
          {detail.backToLibrary}
        </Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="border-slate-200 bg-slate-100 text-slate-700">
                {trackLabel}
              </Badge>
              <Badge className="border-slate-200 bg-white text-slate-700">
                {
                  common.levels[
                    learningModule.level.toLowerCase() as keyof typeof common.levels
                  ]
                }
              </Badge>
            </div>
            <div className="space-y-2">
              <CardTitle>{learningModule.title}</CardTitle>
              <CardDescription>{learningModule.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
              {learningModule.summary ?? detail.summaryFallback}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-950">
                  <BookOpenCheck className="size-4 text-cyan-600" />
                  {detail.questionCountLabel}
                </div>
                <div className="font-display text-3xl font-semibold text-slate-950">
                  {learningModule.counts.questions}
                </div>
              </div>
              <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-950">
                  <Layers3 className="size-4 text-cyan-600" />
                  {detail.skillCountLabel}
                </div>
                <div className="font-display text-3xl font-semibold text-slate-950">
                  {learningModule.counts.skills}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="size-4 text-cyan-300" />
              <CardTitle className="text-white">
                {detail.positioningTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-slate-300">
              {detail.positioningDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {detail.positioningItems.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{detail.skillsTitle}</CardTitle>
            <CardDescription>{detail.skillsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {learningModule.skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <div className="font-medium text-slate-950">{skill.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {skill.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-cyan-600" />
              <CardTitle>{detail.nextBuildTitle}</CardTitle>
            </div>
            <CardDescription>{detail.nextBuildDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <form action={createTrainingSessionAction}>
              <input type="hidden" name="mode" value="PRACTICE" />
              <input type="hidden" name="locale" value={locale} />
              <input
                type="hidden"
                name="moduleSlug"
                value={learningModule.slug}
              />
              <input
                type="hidden"
                name="questionCount"
                value={Math.min(
                  8,
                  Math.max(1, learningModule.counts.questions),
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={learningModule.counts.questions === 0}
              >
                {detail.launchPractice}
              </Button>
            </form>
            {learningModule.counts.questions === 0 ? (
              <p className="text-sm leading-6 text-slate-500">
                {detail.practiceUnavailable}
              </p>
            ) : null}
            {detail.nextBuildItems.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-semibold text-slate-950">
            {detail.questionLibraryTitle}
          </h2>
          <p className="text-sm leading-7 text-slate-600">
            {detail.questionLibraryDescription}
          </p>
        </div>

        {learningModule.questions.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-sm leading-7 text-slate-600">
              {detail.questionLibraryEmpty}
            </CardContent>
          </Card>
        ) : (
          learningModule.questions.map((question) => (
            <QuestionPreviewCard
              key={question.id}
              locale={locale}
              question={question}
              readLessonLabel={detail.readLesson}
              focusedPracticeLabel={detail.focusedPractice}
              skillLabel={learn.question.skillLabel}
              levelLabels={common.levels}
              formatLabels={learn.formatLabels}
              estimatedReadMinutesLabel={
                learn.question.estimatedReadMinutesLabel
              }
              showModule={false}
              questionHrefBase="/dashboard/learn/questions"
            />
          ))
        )}
      </section>
    </div>
  );
}
