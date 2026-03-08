import type { QuestionFormat, QuestionLevel } from "@prisma/client";
import Link from "next/link";
import { BookOpenText, Clock3, Layers3, Sparkles } from "lucide-react";
import { buttonVariants, Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTrainingSessionAction } from "@/features/sessions/session.action";

type QuestionPreview = {
  id: string;
  slug: string;
  prompt: string;
  format: QuestionFormat;
  level: QuestionLevel;
  difficulty: number;
  explanation: string;
  shortAnswer: string | null;
  tlDr: string | null;
  estimatedReadMinutes: number | null;
  primarySkill: {
    title: string;
  };
  module: {
    title: string;
    slug: string;
  };
};

type QuestionPreviewCardProps = {
  locale: "fr" | "en";
  question: QuestionPreview;
  readLessonLabel: string;
  focusedPracticeLabel: string;
  skillLabel: string;
  moduleLabel?: string;
  showModule?: boolean;
  levelLabels: Record<"junior" | "mid" | "senior", string>;
  formatLabels: Record<QuestionFormat, string>;
  estimatedReadMinutesLabel: string;
};

function formatReadTime(template: string, count: number) {
  return template.replace("{count}", String(count));
}

export function QuestionPreviewCard({
  locale,
  question,
  readLessonLabel,
  focusedPracticeLabel,
  skillLabel,
  moduleLabel,
  showModule = true,
  levelLabels,
  formatLabels,
  estimatedReadMinutesLabel,
}: QuestionPreviewCardProps) {
  const summary = question.shortAnswer ?? question.tlDr ?? question.explanation;
  const levelLabel =
    levelLabels[question.level.toLowerCase() as keyof typeof levelLabels];

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
          <span>{formatLabels[question.format]}</span>
          <span>•</span>
          <span>{levelLabel}</span>
          <span>•</span>
          <span>D{question.difficulty}</span>
          {question.estimatedReadMinutes ? (
            <>
              <span>•</span>
              <span>
                {formatReadTime(
                  estimatedReadMinutesLabel,
                  question.estimatedReadMinutes,
                )}
              </span>
            </>
          ) : null}
        </div>
        <CardTitle className="text-2xl text-slate-950">
          {question.prompt}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-slate-600">{summary}</p>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
            <div className="mb-1 flex items-center gap-2 font-medium text-slate-950">
              <Sparkles className="size-4 text-cyan-600" />
              {skillLabel}
            </div>
            <div>{question.primarySkill.title}</div>
          </div>

          {showModule && moduleLabel ? (
            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
              <div className="mb-1 flex items-center gap-2 font-medium text-slate-950">
                <Layers3 className="size-4 text-cyan-600" />
                {moduleLabel}
              </div>
              <div>{question.module.title}</div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/learn/questions/${question.slug}`}
            className={buttonVariants({ variant: "primary", size: "md" })}
          >
            <BookOpenText className="size-4" />
            {readLessonLabel}
          </Link>

          <form action={createTrainingSessionAction}>
            <input type="hidden" name="mode" value="PRACTICE" />
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="questionCount" value="1" />
            <input type="hidden" name="questionIds" value={question.id} />
            <Button
              type="submit"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <Clock3 className="size-4" />
              {focusedPracticeLabel}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
