import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserEntitlementSnapshot } from "@/features/billing/user-entitlements";
import { saveGeneratedPlaylistAction } from "@/features/playlists/playlist.action";
import { getPlaylistReadModel } from "@/features/playlists/playlist-read-model";
import { getSavedPlaylistReadModel } from "@/features/playlists/saved-playlist-read-model";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import Link from "next/link";

export default async function DashboardPlaylistsPage() {
  const user = await getRequiredUser("/dashboard/playlists");
  const { locale, messages } = await getI18n();
  const playlists = messages.dashboard.playlists;
  const entitlements = messages.dashboard.entitlements;
  const entitlement = await getUserEntitlementSnapshot(user.id);

  if (!entitlement.canUsePlaylists) {
    return (
      <div className="grid gap-6">
        <Card className="bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="text-white">{playlists.title}</CardTitle>
            <CardDescription className="text-slate-300">
              {playlists.description}
            </CardDescription>
          </CardHeader>
        </Card>

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

  const [generatedPlaylists, savedPlaylists] = await Promise.all([
    getPlaylistReadModel({
      userId: user.id,
      locale,
    }),
    getSavedPlaylistReadModel({
      userId: user.id,
      locale,
    }),
  ]);
  const updatedAtFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });
  const getModeLabel = (mode: "PRACTICE" | "REVIEW" | "MOCK_INTERVIEW") =>
    mode === "REVIEW"
      ? playlists.modeLabels.REVIEW
      : mode === "MOCK_INTERVIEW"
        ? playlists.modeLabels.MOCK_INTERVIEW
        : playlists.modeLabels.PRACTICE;

  return (
    <div className="grid gap-6">
      <Card className="bg-slate-950 text-white">
        <CardHeader>
          <CardTitle className="text-white">{playlists.title}</CardTitle>
          <CardDescription className="text-slate-300">
            {playlists.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {savedPlaylists.items.length > 0 ? (
        <section className="grid gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-950">
              {playlists.savedTitle}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              {playlists.savedDescription}
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {savedPlaylists.items.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="w-fit border-slate-200 bg-slate-100 text-slate-700">
                          {getModeLabel(item.mode)}
                        </Badge>
                        <Badge className="w-fit border-cyan-200 bg-cyan-50 text-cyan-700">
                          {playlists.kindLabels[item.kind]}
                        </Badge>
                      </div>
                      <CardTitle className="mt-3">{item.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {item.description ?? playlists.savedDescriptionFallback}
                      </CardDescription>
                    </div>
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-right">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {playlists.questionCountLabel}
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-slate-950">
                        {item.questionCount}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {playlists.focusSkillsLabel}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.focusSkills.length > 0 ? (
                        item.focusSkills.map((skill) => (
                          <Badge
                            key={`${item.id}-${skill}`}
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
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>
                      {playlists.updatedAtLabel}:{" "}
                      {updatedAtFormatter.format(item.updatedAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <form action={createTrainingSessionAction}>
                      <input type="hidden" name="mode" value={item.mode} />
                      <input type="hidden" name="locale" value={locale} />
                      <input
                        type="hidden"
                        name="questionCount"
                        value={String(item.questionCount)}
                      />
                      {item.questionIds.map((questionId) => (
                        <input
                          key={`${item.id}-${questionId}`}
                          type="hidden"
                          name="questionIds"
                          value={questionId}
                        />
                      ))}
                      <Button type="submit" disabled={item.questionCount === 0}>
                        {playlists.launchAction}
                      </Button>
                    </form>
                    <Link
                      href={`/dashboard/playlists/${item.id}`}
                      className="inline-flex h-11 items-center rounded-2xl border border-transparent px-4 text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
                    >
                      {playlists.editAction}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ) : (
        <Card className="border-dashed border-slate-300 bg-slate-50/80">
          <CardContent className="pt-6 text-sm leading-6 text-slate-600">
            <div className="font-medium text-slate-950">
              {playlists.savedEmptyTitle}
            </div>
            <p className="mt-2">{playlists.savedEmptyDescription}</p>
          </CardContent>
        </Card>
      )}

      {generatedPlaylists.items.length > 0 ? (
        <section className="grid gap-6 xl:grid-cols-2">
          {generatedPlaylists.items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Badge className="w-fit border-slate-200 bg-slate-100 text-slate-700">
                      {getModeLabel(item.mode)}
                    </Badge>
                    <CardTitle className="mt-3">
                      {playlists.types[item.type].label}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {playlists.types[item.type].description}
                    </CardDescription>
                  </div>
                  <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-right">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {playlists.questionCountLabel}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-slate-950">
                      {item.questionCount}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {playlists.focusSkillsLabel}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.focusSkills.map((skill) => (
                      <Badge
                        key={`${item.id}-${skill}`}
                        className="border-slate-200 bg-white text-slate-700"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
                    {item.signalCount}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    {playlists.questionCountLabel}: {item.questionCount}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <form action={createTrainingSessionAction}>
                    <input type="hidden" name="mode" value={item.mode} />
                    <input type="hidden" name="locale" value={locale} />
                    <input
                      type="hidden"
                      name="questionCount"
                      value={String(item.questionCount)}
                    />
                    {item.questionIds.map((questionId) => (
                      <input
                        key={`${item.id}-${questionId}`}
                        type="hidden"
                        name="questionIds"
                        value={questionId}
                      />
                    ))}
                    <Button type="submit">{playlists.launchAction}</Button>
                  </form>
                  {item.moduleSlug ? (
                    <Link
                      href={`/dashboard/modules/${item.moduleSlug}`}
                      className="inline-flex h-11 items-center rounded-2xl border border-transparent px-4 text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
                    >
                      {playlists.openModuleAction}
                    </Link>
                  ) : null}
                  <form action={saveGeneratedPlaylistAction}>
                    <input
                      type="hidden"
                      name="name"
                      value={playlists.types[item.type].label}
                    />
                    <input
                      type="hidden"
                      name="description"
                      value={playlists.types[item.type].description}
                    />
                    <input type="hidden" name="mode" value={item.mode} />
                    <input type="hidden" name="sourceKey" value={item.id} />
                    {item.questionIds.map((questionId) => (
                      <input
                        key={`save-${item.id}-${questionId}`}
                        type="hidden"
                        name="questionIds"
                        value={questionId}
                      />
                    ))}
                    <Button type="submit" variant="secondary">
                      {playlists.saveAction}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <Card className="border-dashed border-slate-300 bg-slate-50/80">
          <CardContent className="pt-6 text-sm leading-6 text-slate-600">
            <div className="font-medium text-slate-950">
              {playlists.emptyTitle}
            </div>
            <p className="mt-2">{playlists.emptyDescription}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
