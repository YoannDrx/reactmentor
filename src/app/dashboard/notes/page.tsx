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
import { NoteEditorForm } from "@/features/notes/note-editor-form";
import { getNoteReadModel, type NoteStatus } from "@/features/notes/note-read-model";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";

const noteStatusClasses: Record<NoteStatus, string> = {
  pendingReview: "border-cyan-200 bg-cyan-50 text-cyan-700",
  due: "border-amber-200 bg-amber-50 text-amber-700",
  stable: "border-emerald-200 bg-emerald-50 text-emerald-700",
  saved: "border-slate-200 bg-slate-100 text-slate-700",
};

export default async function DashboardNotesPage() {
  const user = await getRequiredUser("/dashboard/notes");
  const { locale, messages } = await getI18n();
  const notes = messages.dashboard.notes;
  const bookmarks = messages.dashboard.bookmarks;
  const readModel = await getNoteReadModel({
    userId: user.id,
    locale,
  });

  return (
    <div className="grid gap-6">
      <Card className="bg-slate-950 text-white">
        <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <CardTitle className="text-white">{notes.title}</CardTitle>
            <CardDescription className="text-slate-300">
              {notes.description}
            </CardDescription>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem]">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {notes.noteCountLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {readModel.count}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {notes.dueCountLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-amber-200">
                {readModel.dueCount}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {notes.pendingCountLabel}
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
          <CardTitle>{notes.listTitle}</CardTitle>
          <CardDescription>{notes.listDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {readModel.items.length > 0 ? (
            readModel.items.map((item) => (
              <div
                key={item.noteId}
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
                  <Badge className={noteStatusClasses[item.status]}>
                    {notes.statusLabels[item.status]}
                  </Badge>
                </div>

                <div className="mt-3 text-sm text-slate-500">{item.skill}</div>

                <div className="mt-4">
                  <NoteEditorForm
                    questionId={item.questionId}
                    body={item.body}
                    updatedAt={item.updatedAt}
                    pathToRevalidate="/dashboard/notes"
                    title={notes.editorTitle}
                    placeholder={notes.editorPlaceholder}
                    saveLabel={notes.saveAction}
                    clearLabel={notes.clearAction}
                    updatedAtLabel={notes.updatedAtLabel}
                    locale={locale}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <BookmarkToggleForm
                    questionId={item.questionId}
                    isBookmarked={item.isBookmarked}
                    pathToRevalidate="/dashboard/notes"
                    saveLabel={bookmarks.saveAction}
                    removeLabel={bookmarks.removeAction}
                    variant="secondary"
                  />
                  <Link
                    href={`/dashboard/modules/${item.moduleSlug}`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    {notes.openModuleAction}
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
                      {notes.launchPracticeAction}
                    </Button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 text-sm leading-6 text-slate-600">
              <div className="font-medium text-slate-950">{notes.emptyTitle}</div>
              <p className="mt-2">{notes.emptyDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
