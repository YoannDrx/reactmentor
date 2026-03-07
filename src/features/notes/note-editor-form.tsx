import { Button } from "@/components/ui/button";
import { saveQuestionNoteAction } from "./note.action";

export function NoteEditorForm(params: {
  questionId: string;
  body: string | null;
  updatedAt: Date | null;
  pathToRevalidate: string;
  title: string;
  placeholder: string;
  saveLabel: string;
  clearLabel: string;
  updatedAtLabel: string;
  locale: string;
}) {
  const updatedAtFormatter = new Intl.DateTimeFormat(params.locale, {
    dateStyle: "medium",
  });

  return (
    <form
      action={saveQuestionNoteAction}
      className="rounded-[22px] border border-slate-200 bg-white p-4"
    >
      <input type="hidden" name="questionId" value={params.questionId} />
      <input
        type="hidden"
        name="pathToRevalidate"
        value={params.pathToRevalidate}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {params.title}
        </div>
        {params.updatedAt ? (
          <div className="text-xs text-slate-500">
            {params.updatedAtLabel} {updatedAtFormatter.format(params.updatedAt)}
          </div>
        ) : null}
      </div>

      <textarea
        name="body"
        rows={4}
        defaultValue={params.body ?? ""}
        placeholder={params.placeholder}
        className="mt-3 min-h-28 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-950 outline-hidden transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="submit">{params.saveLabel}</Button>
        <Button type="submit" name="clear" value="true" variant="secondary">
          {params.clearLabel}
        </Button>
      </div>
    </form>
  );
}
