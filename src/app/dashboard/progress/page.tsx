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
  MasteryBreakdownChart,
  SkillRadarChart,
  WeeklyMomentumChart,
} from "@/features/dashboard/dashboard-charts";
import { getDashboardRecommendation } from "@/features/dashboard/dashboard-recommendations";
import { getDashboardReadModel } from "@/features/dashboard/dashboard-read-model";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { formatPercent } from "@/lib/utils";
import Link from "next/link";

function getSkillNote(
  skill: {
    score: number;
    masteryCap: number;
    confidenceScore: number;
    recentFailureCount: number;
  },
  progressMessages: {
    notes: {
      stable: string;
      medium: string;
      fragile: string;
    };
  },
) {
  if (
    skill.score >= 75 &&
    skill.confidenceScore >= 70 &&
    skill.recentFailureCount === 0
  ) {
    return progressMessages.notes.stable;
  }

  if (
    skill.score >= 60 &&
    skill.confidenceScore >= 45 &&
    skill.recentFailureCount <= 1
  ) {
    return progressMessages.notes.medium;
  }

  return progressMessages.notes.fragile;
}

function getSignalState(confidenceScore: number) {
  if (confidenceScore >= 70) {
    return "high" as const;
  }

  if (confidenceScore >= 45) {
    return "medium" as const;
  }

  return "low" as const;
}

export default async function DashboardProgressPage() {
  const user = await getRequiredUser("/dashboard/progress");
  const { locale, messages, t } = await getI18n();
  const progress = messages.dashboard.progress;
  const readModel = await getDashboardReadModel(user.id, locale);
  const recommendation = await getDashboardRecommendation(user.id, locale);
  const skillRadar = readModel.progress.skillBreakdown;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  });
  const weeklyMomentumData = readModel.progress.weeklyMomentum.map((item) => ({
    day: messages.common.days[item.dayKey],
    score: item.score,
  }));
  const recoveryPlans = new Map(
    readModel.progress.recoveryPlans.map((plan) => [plan.skillId, plan]),
  );
  const masteryData = [
    {
      band: messages.dashboard.masteryLabels.new,
      value: readModel.progress.masteryDistribution.new,
    },
    {
      band: messages.dashboard.masteryLabels.learning,
      value: readModel.progress.masteryDistribution.learning,
    },
    {
      band: messages.dashboard.masteryLabels.reviewing,
      value: readModel.progress.masteryDistribution.reviewing,
    },
    {
      band: messages.dashboard.masteryLabels.mastered,
      value: readModel.progress.masteryDistribution.mastered,
    },
  ];

  return (
    <div className="grid gap-6">
      {!readModel.hasAttempts ? (
        <Card className="border-dashed border-slate-300 bg-slate-50/80">
          <CardContent className="space-y-4 pt-6 text-sm leading-6 text-slate-600">
            <div className="font-medium text-slate-950">
              {progress.emptyTitle}
            </div>
            <p className="mt-2">{progress.emptyDescription}</p>
            {recommendation.kind === "module" ? (
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/dashboard/modules/${recommendation.moduleSlug}`}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  {progress.emptyModuleAction}
                </Link>
                <Link
                  href="/learn"
                  className={buttonVariants({ variant: "secondary", size: "md" })}
                >
                  {progress.emptyLearnAction}
                </Link>
              </div>
            ) : recommendation.kind === "review" ? (
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/review"
                  className={buttonVariants({ variant: "secondary", size: "md" })}
                >
                  {progress.emptyReviewAction}
                </Link>
                <Link
                  href="/learn"
                  className={buttonVariants({ variant: "ghost", size: "md" })}
                >
                  {progress.emptyLearnAction}
                </Link>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{progress.masteryMapTitle}</CardTitle>
            <CardDescription>{progress.masteryMapDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillRadarChart data={skillRadar} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{progress.distributionTitle}</CardTitle>
            <CardDescription>
              {progress.distributionDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MasteryBreakdownChart data={masteryData} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{progress.signalTitle}</CardTitle>
            <CardDescription>{progress.signalDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyMomentumChart data={weeklyMomentumData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{progress.skillBySkillTitle}</CardTitle>
            <CardDescription>
              {progress.skillBySkillDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillRadar.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <div>
                  <div className="font-medium text-slate-950">{item.skill}</div>
                  <div className="text-sm text-slate-500">
                    {getSkillNote(item, progress)}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      className={
                        getSignalState(item.confidenceScore) === "high"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : getSignalState(item.confidenceScore) === "medium"
                            ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                            : "border-orange-200 bg-orange-50 text-orange-700"
                      }
                    >
                      {
                        progress.signalStates[
                          getSignalState(item.confidenceScore)
                        ]
                      }
                    </Badge>
                    <Badge className="border-slate-200 bg-white text-slate-700">
                      {t("dashboard.progress.masteryCapLabel", {
                        score: item.masteryCap,
                      })}
                    </Badge>
                    <Badge className="border-slate-200 bg-white text-slate-700">
                      {t("dashboard.progress.confidenceLabel", {
                        score: item.confidenceScore,
                      })}
                    </Badge>
                    <Badge className="border-slate-200 bg-white text-slate-700">
                      {t("dashboard.progress.recentAttemptsLabel", {
                        count: item.recentAttemptCount,
                      })}
                    </Badge>
                    <Badge className="border-slate-200 bg-white text-slate-700">
                      {t("dashboard.progress.questionsCoveredLabel", {
                        count: item.uniqueQuestionCount,
                      })}
                    </Badge>
                    {item.recentFailureCount > 0 ? (
                      <Badge className="border-rose-200 bg-rose-50 text-rose-700">
                        {t("dashboard.progress.recentFailuresLabel", {
                          count: item.recentFailureCount,
                        })}
                      </Badge>
                    ) : null}
                  </div>
                  {item.lastAttemptAt ? (
                    <div className="mt-3 text-xs text-slate-400">
                      {t("dashboard.progress.lastSignalLabel", {
                        date: dateFormatter.format(item.lastAttemptAt),
                      })}
                    </div>
                  ) : null}
                  {item.signalDetails ? (
                    <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                      <div>
                        {t("dashboard.progress.weightedAccuracyLabel", {
                          score: formatPercent(item.correctRate),
                        })}
                      </div>
                      <div>
                        {t("dashboard.progress.boostScoreLabel", {
                          score: item.signalDetails.boostScore,
                        })}
                      </div>
                      <div>
                        {t("dashboard.progress.penaltyScoreLabel", {
                          score: item.signalDetails.penaltyScore,
                        })}
                      </div>
                      <div>
                        {t("dashboard.progress.freshnessCapDetailLabel", {
                          score: item.signalDetails.freshnessCap,
                          days: item.signalDetails.lastAttemptAgeInDays,
                        })}
                      </div>
                      <div className="sm:col-span-2">
                        {t("dashboard.progress.confidenceDriversLabel", {
                          coverage:
                            item.signalDetails.confidence.coverageConfidence,
                          breadth: item.signalDetails.confidence.breadthConfidence,
                          freshness:
                            item.signalDetails.confidence.freshnessBonus,
                        })}
                      </div>
                    </div>
                  ) : null}
                  {recoveryPlans.has(item.id) ? (
                    <div className="mt-4 space-y-3">
                      {(() => {
                        const recoveryPlan = recoveryPlans.get(item.id);

                        if (!recoveryPlan || recoveryPlan.recoveryQuestions.length === 0) {
                          return null;
                        }

                        return (
                          <div>
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                              {progress.recoveryQuestionsLabel}
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {recoveryPlan.recoveryQuestions.map((question) => (
                                <Link
                                  key={`${recoveryPlan.skillId}-${question.questionId}`}
                                  href={`/learn/questions/${question.questionSlug}`}
                                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-cyan-300 hover:text-slate-950"
                                >
                                  {question.prompt}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                      <div className="text-sm leading-6 text-slate-600">
                        {(() => {
                          const recoveryPlan = recoveryPlans.get(item.id);

                          if (!recoveryPlan) {
                            return null;
                          }

                          if (recoveryPlan.reason === "dueNow") {
                            return t(
                              "dashboard.progress.recoveryReasons.dueNow",
                              {
                                count: recoveryPlan.dueCount,
                              },
                            );
                          }

                          if (recoveryPlan.reason === "pendingReview") {
                            return t(
                              "dashboard.progress.recoveryReasons.pendingReview",
                              {
                                count: recoveryPlan.pendingCount,
                              },
                            );
                          }

                          return t(
                            "dashboard.progress.recoveryReasons.weakSignal",
                          );
                        })()}
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {(() => {
                          const recoveryPlan = recoveryPlans.get(item.id);

                          if (!recoveryPlan) {
                            return null;
                          }

                          return (
                            <>
                              {recoveryPlan.recoveryQuestionIds.length > 0 ? (
                                <form action={createTrainingSessionAction}>
                                  <input
                                    type="hidden"
                                    name="mode"
                                    value="REVIEW"
                                  />
                                  <input
                                    type="hidden"
                                    name="locale"
                                    value={locale}
                                  />
                                  <input
                                    type="hidden"
                                    name="questionCount"
                                    value={String(
                                      recoveryPlan.recoveryQuestionIds.length,
                                    )}
                                  />
                                  {recoveryPlan.recoveryQuestionIds.map(
                                    (questionId) => (
                                      <input
                                        key={`${recoveryPlan.skillId}-${questionId}`}
                                        type="hidden"
                                        name="questionIds"
                                        value={questionId}
                                      />
                                    ),
                                  )}
                                  <Button type="submit" size="sm">
                                    {progress.actions.startRecoveryReview}
                                  </Button>
                                </form>
                              ) : null}
                              {recoveryPlan.pendingCount > 0 ? (
                                <Link
                                  href="/dashboard/review"
                                  className={buttonVariants({
                                    variant: "secondary",
                                    size: "sm",
                                  })}
                                >
                                  {progress.actions.openPendingReview}
                                </Link>
                              ) : null}
                              {recoveryPlan.moduleSlug ? (
                                <Link
                                  href={`/dashboard/modules/${recoveryPlan.moduleSlug}`}
                                  className={buttonVariants({
                                    variant: "ghost",
                                    size: "sm",
                                  })}
                                >
                                  {progress.actions.openRecoveryModule}
                                </Link>
                              ) : null}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  ) : null}
                </div>
                <Badge
                  className={
                    item.score >= 75
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : item.score >= 60
                        ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                        : "border-orange-200 bg-orange-50 text-orange-700"
                  }
                >
                  {formatPercent(item.score)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
