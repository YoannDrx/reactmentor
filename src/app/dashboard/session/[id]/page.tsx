import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SessionPlayer } from "@/features/sessions/session-player";
import { mockTemplateKeys } from "@/features/sessions/session-contract";
import { getMockTemplateTitle } from "@/features/sessions/session-timing";
import { getTrainingSessionView } from "@/features/sessions/session-view";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/utils";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { ArrowLeft, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DashboardSessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getRequiredUser(`/dashboard/session/${id}`);
  const { locale, messages, t } = await getI18n();
  const sessionView = await getTrainingSessionView({
    sessionId: id,
    userId: user.id,
    locale,
  });

  if (!sessionView) {
    notFound();
  }

  const sessionMessages = messages.dashboard.session;
  const modeLabel = sessionMessages.modeLabels[sessionView.mode];
  const mockTemplateTitles = Object.fromEntries(
    mockTemplateKeys.map((key, index) => [
      key,
      messages.dashboard.mockTemplates[index]?.title ?? modeLabel,
    ]),
  );
  const mockTemplateTitle = getMockTemplateTitle(
    sessionView.mockReport?.templateKey,
    mockTemplateTitles,
    modeLabel,
  );

  if (!sessionView.currentQuestion) {
    return (
      <div className="grid gap-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600"
          >
            <ArrowLeft className="size-4" />
            {sessionMessages.backToDashboard}
          </Link>
        </div>

        <Card className="overflow-hidden bg-slate-950 text-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="size-5 text-cyan-300" />
              <Badge className="border-white/10 bg-white/10 text-cyan-100">
                {sessionMessages.completedBadge}
              </Badge>
            </div>
            <CardTitle className="text-white">{sessionMessages.completedTitle}</CardTitle>
          </CardHeader>
          <CardContent
            className={cn(
              "grid gap-4",
              sessionView.mockReport ? "md:grid-cols-4" : "md:grid-cols-3",
            )}
          >
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {modeLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {sessionView.score}%
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {sessionMessages.correctAnswersLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {sessionView.correctAnswers}/{sessionView.totalQuestions}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {sessionMessages.questionsAnsweredLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {sessionView.answeredCount}
              </div>
            </div>
            {sessionView.mockReport ? (
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {sessionMessages.timeSpentLabel}
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {t("dashboard.session.minutesShort", {
                    count: sessionView.mockReport.timeSpentMinutes,
                  })}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {sessionView.mockReport ? (
          <Card>
            <CardHeader>
              <CardTitle>{sessionMessages.mockReportTitle}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {mockTemplateTitle}
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {sessionMessages.mockReportDescription}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      {sessionMessages.timeBudgetLabel}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-slate-950">
                      {t("dashboard.session.minutesShort", {
                        count: sessionView.mockReport.timeBudgetMinutes,
                      })}
                    </div>
                  </div>
                  <div className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      {sessionMessages.mockPressureLabel}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-slate-950">
                      {
                        sessionMessages.mockPressureStates[
                          sessionView.mockReport.pressureState
                        ]
                      }
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {
                        sessionMessages.mockPressureDescriptions[
                          sessionView.mockReport.pressureState
                        ]
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="grid gap-6">
                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle>{sessionMessages.mockSkillsTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {sessionView.mockReport.skillBreakdown.map((skill) => (
                        <div
                          key={skill.skill}
                          className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-medium text-slate-950">
                              {skill.skill}
                            </div>
                            <Badge className="border-slate-200 bg-white text-slate-700">
                              {skill.accuracyPercent}%
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {t("dashboard.session.mockSkillsSummary", {
                              correct: skill.correctCount,
                              total: skill.questionCount,
                            })}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader>
                      <CardTitle>{sessionMessages.mockVerbalizeTitle}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {sessionView.mockReport.verbalizePoints.map((point) => (
                        <div
                          key={point}
                          className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
                        >
                          {point}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle>{sessionMessages.mockRiskTitle}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {sessionView.mockReport.riskItems.length > 0 ? (
                      sessionView.mockReport.riskItems.map((item) => (
                        <div
                          key={item.questionId}
                          className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <Badge
                              className={
                                item.status === "incorrect"
                                  ? "border-rose-200 bg-rose-50 text-rose-700"
                                  : "border-amber-200 bg-amber-50 text-amber-700"
                              }
                            >
                              {item.status === "incorrect"
                                ? sessionMessages.mockRiskStates.incorrect
                                : sessionMessages.mockRiskStates.unanswered}
                            </Badge>
                            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                              {item.skill}
                            </div>
                          </div>
                          <div className="font-medium text-slate-950">
                            {item.prompt}
                          </div>
                          {item.verbalizePoints.length > 0 ? (
                            <div className="mt-3 space-y-2">
                              {item.verbalizePoints.map((point) => (
                                <div
                                  key={point}
                                  className="rounded-[18px] border border-white bg-white px-3 py-2 text-sm leading-6 text-slate-700"
                                >
                                  {point}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                        {sessionMessages.mockRiskEmpty}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="flex gap-3">
          <Link
            href="/dashboard"
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            {sessionMessages.backToDashboard}
          </Link>
          <Link
            href="/dashboard/modules"
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            {sessionMessages.backToModules}
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = sessionView.currentQuestion.question;
  const takeaways = Array.isArray(currentQuestion.takeaways)
    ? currentQuestion.takeaways.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <SessionPlayer
      key={currentQuestion.id}
      sessionId={sessionView.id}
      modeLabel={modeLabel}
      currentIndex={sessionView.currentQuestion.order}
      totalQuestions={sessionView.totalQuestions}
      progressPercent={sessionView.progressPercent}
      skillLabel={sessionView.currentQuestion.skill.title}
      moduleLabel={sessionView.currentQuestion.module.title}
      question={{
        id: currentQuestion.id,
        prompt: currentQuestion.prompt,
        explanation: currentQuestion.explanation,
        takeaways,
        options: currentQuestion.options.map((option) => ({
          id: option.id,
          label: option.label,
          explanation: option.explanation,
          isCorrect: option.isCorrect,
        })),
      }}
      timing={sessionView.timing}
      messages={{
        progressLabel: t("dashboard.session.progressLabel", {
          current: sessionView.currentQuestion.order,
          total: sessionView.totalQuestions,
        }),
        submitAnswer: sessionMessages.submitAnswer,
        retryAnswer: sessionMessages.retryAnswer,
        submitting: sessionMessages.submitting,
        nextQuestion: sessionMessages.nextQuestion,
        finishSession: sessionMessages.finishSession,
        loadingNextQuestion: sessionMessages.loadingNextQuestion,
        loadingSessionResult: sessionMessages.loadingSessionResult,
        selectionRequired: sessionMessages.selectionRequired,
        correctState: sessionMessages.correctState,
        incorrectState: sessionMessages.incorrectState,
        keyboardHint: sessionMessages.keyboardHint,
        explanationTitle: sessionMessages.explanationTitle,
        takeawaysTitle: sessionMessages.takeawaysTitle,
        recoveryTitle: sessionMessages.recoveryTitle,
        recoveryHint: sessionMessages.recoveryHint,
        timerLabel: sessionMessages.timerLabel,
        timeRemainingLabel: sessionMessages.timeRemainingLabel,
        timeBudgetLabel: sessionMessages.timeBudgetLabel,
        timerExpiredToast: sessionMessages.timerExpiredToast,
        timedModeBadge: sessionMessages.timedModeBadge,
        backToDashboard: sessionMessages.backToDashboard,
        errors: sessionMessages.errors,
      }}
    />
  );
}
