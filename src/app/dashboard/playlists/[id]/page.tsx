import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  deletePlaylistAction,
  removePlaylistQuestionAction,
  updatePlaylistAction,
} from "@/features/playlists/playlist.action";
import { getUserEntitlementSnapshot } from "@/features/billing/user-entitlements";
import { getSavedPlaylistDetail } from "@/features/playlists/saved-playlist-read-model";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DashboardPlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getRequiredUser(`/dashboard/playlists/${id}`);
  const { locale, messages } = await getI18n();
  const playlists = messages.dashboard.playlists;
  const entitlements = messages.dashboard.entitlements;
  const learn = messages.learn;
  const entitlement = await getUserEntitlementSnapshot(user.id);

  if (!entitlement.canUsePlaylists) {
    return (
      <div className="grid gap-6">
        <div>
          <Link
            href="/dashboard/playlists"
            className="text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
          >
            {playlists.backAction}
          </Link>
        </div>

        <Card className="border-amber-200 bg-amber-50/80">
          <CardHeader>
            <Badge className="w-fit border-amber-200 bg-amber-100 text-amber-800">
              {entitlements.gates.playlists.badge}
            </Badge>
            <CardTitle>{entitlements.gates.playlists.title}</CardTitle>
            <CardDescription className="text-amber-950/80">
              {entitlements.gates.playlists.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-[22px] border border-amber-200 bg-white/80 px-4 py-3 text-sm text-amber-950">
              {entitlements.currentPlanLabel}:{" "}
              {entitlements.planLabels[entitlement.plan]}
            </div>
            <Link
              href="/dashboard/settings"
              className={buttonVariants({ variant: "secondary", size: "md" })}
            >
              {entitlements.gates.playlists.action}
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const playlist = await getSavedPlaylistDetail({
    playlistId: id,
    userId: user.id,
    locale,
  });

  if (!playlist) {
    notFound();
  }

  const modeLabel =
    playlist.mode === "REVIEW"
      ? playlists.modeLabels.REVIEW
      : playlist.mode === "MOCK_INTERVIEW"
        ? playlists.modeLabels.MOCK_INTERVIEW
        : playlists.modeLabels.PRACTICE;

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/playlists"
            className="text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
          >
            {playlists.backAction}
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {playlist.name}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {playlist.description ?? playlists.savedDescriptionFallback}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-slate-200 bg-slate-100 text-slate-700">
            {modeLabel}
          </Badge>
          <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
            {playlists.kindLabels[playlist.kind]}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{playlists.manageTitle}</CardTitle>
              <CardDescription>{playlists.manageDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updatePlaylistAction} className="grid gap-4">
                <input type="hidden" name="playlistId" value={playlist.id} />

                <div className="space-y-2">
                  <label
                    htmlFor="playlist-name"
                    className="text-sm font-medium text-slate-950"
                  >
                    {playlists.nameLabel}
                  </label>
                  <Input
                    id="playlist-name"
                    name="name"
                    defaultValue={playlist.name}
                    maxLength={120}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="playlist-description"
                    className="text-sm font-medium text-slate-950"
                  >
                    {playlists.descriptionLabel}
                  </label>
                  <textarea
                    id="playlist-description"
                    name="description"
                    defaultValue={playlist.description ?? ""}
                    maxLength={400}
                    rows={5}
                    className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.35)] outline-hidden transition focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>

                <Button type="submit">{playlists.saveChangesAction}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{playlists.launchSavedTitle}</CardTitle>
              <CardDescription>
                {playlists.launchSavedDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="border-slate-200 bg-slate-100 text-slate-700">
                  {playlists.questionCountLabel}: {playlist.questionCount}
                </Badge>
                <Badge className="border-slate-200 bg-slate-100 text-slate-700">
                  {playlists.focusSkillsLabel}: {playlist.focusSkills.length}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {playlist.focusSkills.length > 0 ? (
                  playlist.focusSkills.map((skill) => (
                    <Badge
                      key={`${playlist.id}-${skill}`}
                      className="border-slate-200 bg-white text-slate-700"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">
                    {playlists.focusSkillsEmpty}
                  </span>
                )}
              </div>

              <form action={createTrainingSessionAction}>
                <input type="hidden" name="mode" value={playlist.mode} />
                <input type="hidden" name="locale" value={locale} />
                <input
                  type="hidden"
                  name="questionCount"
                  value={String(playlist.questionCount)}
                />
                {playlist.questionIds.map((questionId) => (
                  <input
                    key={`${playlist.id}-${questionId}`}
                    type="hidden"
                    name="questionIds"
                    value={questionId}
                  />
                ))}
                <Button type="submit" disabled={playlist.questionCount === 0}>
                  {playlists.launchAction}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-rose-200 bg-rose-50/70">
            <CardHeader>
              <CardTitle className="text-rose-950">
                {playlists.dangerTitle}
              </CardTitle>
              <CardDescription className="text-rose-900/75">
                {playlists.dangerDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={deletePlaylistAction}>
                <input type="hidden" name="playlistId" value={playlist.id} />
                <Button type="submit" variant="dark">
                  {playlists.deleteAction}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{playlists.questionsTitle}</CardTitle>
            <CardDescription>{playlists.questionsDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            {playlist.questions.length > 0 ? (
              <div className="space-y-4">
                {playlist.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-[26px] border border-slate-200 bg-slate-50/70 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-3">
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {playlists.questionOrderLabel.replace(
                            "{count}",
                            String(index + 1),
                          )}
                        </div>
                        <div className="text-base font-medium text-slate-950">
                          {question.prompt}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                          <Badge className="border-slate-200 bg-white text-slate-700">
                            {question.skill}
                          </Badge>
                          <span>{question.module}</span>
                          <span>·</span>
                          <span>{learn.formatLabels[question.format]}</span>
                          <span>·</span>
                          <span>
                            {playlists.questionDifficultyLabel}:{" "}
                            {question.difficulty}
                          </span>
                          {question.estimatedTimeSec ? (
                            <>
                              <span>·</span>
                              <span>
                                {playlists.questionTimeLabel}:{" "}
                                {Math.max(
                                  1,
                                  Math.round(question.estimatedTimeSec / 60),
                                )}{" "}
                                min
                              </span>
                            </>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/learn/questions/${question.slug}`}
                          className={buttonVariants({
                            variant: "secondary",
                            size: "sm",
                          })}
                        >
                          {playlists.readLessonAction}
                        </Link>
                        <Link
                          href={`/dashboard/modules/${question.moduleSlug}`}
                          className="inline-flex h-11 items-center rounded-2xl border border-transparent px-4 text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
                        >
                          {playlists.openModuleAction}
                        </Link>
                        <form action={removePlaylistQuestionAction}>
                          <input
                            type="hidden"
                            name="playlistId"
                            value={playlist.id}
                          />
                          <input
                            type="hidden"
                            name="questionId"
                            value={question.id}
                          />
                          <Button type="submit" variant="secondary">
                            {playlists.removeQuestionAction}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] border border-dashed border-slate-300 bg-slate-50/80 p-6 text-sm leading-6 text-slate-600">
                <div className="font-medium text-slate-950">
                  {playlists.emptyDetailTitle}
                </div>
                <p className="mt-2">{playlists.emptyDetailDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
