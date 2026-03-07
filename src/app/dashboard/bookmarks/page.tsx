import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookmarkToggleForm } from "@/features/bookmarks/bookmark-toggle-form";
import {
  getBookmarkReadModel,
  type BookmarkStatus,
} from "@/features/bookmarks/bookmark-read-model";
import { NoteEditorForm } from "@/features/notes/note-editor-form";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";

const bookmarkStatusClasses: Record<BookmarkStatus, string> = {
  pendingReview: "border-cyan-200 bg-cyan-50 text-cyan-700",
  due: "border-amber-200 bg-amber-50 text-amber-700",
  stable: "border-emerald-200 bg-emerald-50 text-emerald-700",
  saved: "border-slate-200 bg-slate-100 text-slate-700",
};

export default async function DashboardBookmarksPage() {
  const user = await getRequiredUser("/dashboard/bookmarks");
  const { locale, messages } = await getI18n();
  const bookmarks = messages.dashboard.bookmarks;
  const notes = messages.dashboard.notes;
  const readModel = await getBookmarkReadModel({
    userId: user.id,
    locale,
  });
  const savedAtFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });

  return (
    <div className="grid gap-6">
      <Card className="bg-slate-950 text-white">
        <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <CardTitle className="text-white">{bookmarks.title}</CardTitle>
            <CardDescription className="text-slate-300">
              {bookmarks.description}
            </CardDescription>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem]">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {bookmarks.savedCountLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {readModel.count}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {bookmarks.dueCountLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-amber-200">
                {readModel.dueCount}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {bookmarks.pendingCountLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-cyan-200">
                {readModel.pendingCount}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{bookmarks.listTitle}</CardTitle>
          <CardDescription>{bookmarks.listDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {readModel.items.length > 0 ? (
            readModel.items.map((item) => (
              <div
                key={item.bookmarkId}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {item.module}
                    </div>
                    <div className="mt-2 font-medium text-slate-950">
                      {item.prompt}
                    </div>
                  </div>
                  <Badge className={bookmarkStatusClasses[item.status]}>
                    {bookmarks.statusLabels[item.status]}
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{item.skill}</span>
                  <span className="text-slate-300">•</span>
                  <span>
                    {bookmarks.savedAtLabel}{" "}
                    {savedAtFormatter.format(item.createdAt)}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <BookmarkToggleForm
                    questionId={item.questionId}
                    isBookmarked
                    pathToRevalidate="/dashboard/bookmarks"
                    saveLabel={bookmarks.saveAction}
                    removeLabel={bookmarks.removeAction}
                    variant="secondary"
                  />
                  <Link
                    href={`/dashboard/modules/${item.moduleSlug}`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    {bookmarks.openModuleAction}
                  </Link>
                  <form action={createTrainingSessionAction}>
                    <input type="hidden" name="mode" value="PRACTICE" />
                    <input type="hidden" name="locale" value={locale} />
                    <input
                      type="hidden"
                      name="moduleSlug"
                      value={item.moduleSlug}
                    />
                    <Button type="submit" size="sm">
                      {bookmarks.launchPracticeAction}
                    </Button>
                  </form>
                </div>

                <div className="mt-4">
                  <NoteEditorForm
                    questionId={item.questionId}
                    body={item.noteBody}
                    updatedAt={item.noteUpdatedAt}
                    pathToRevalidate="/dashboard/bookmarks"
                    title={notes.editorTitle}
                    placeholder={notes.editorPlaceholder}
                    saveLabel={notes.saveAction}
                    clearLabel={notes.clearAction}
                    updatedAtLabel={notes.updatedAtLabel}
                    locale={locale}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 text-sm leading-6 text-slate-600">
              <div className="font-medium text-slate-950">
                {bookmarks.emptyTitle}
              </div>
              <p className="mt-2">{bookmarks.emptyDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
