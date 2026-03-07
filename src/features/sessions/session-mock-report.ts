import type { QuestionFormat } from "@prisma/client";
import { buildSessionRubric, type SessionRubricCriterion } from "./session-rubric";

export type MockReportQuestionInput = {
  questionId: string;
  prompt: string;
  skill: string;
  format: QuestionFormat;
  isBookmarked: boolean;
  noteBody: string | null;
  noteUpdatedAt: Date | null;
  attempted: boolean;
  isCorrect: boolean | null;
  scorePercent: number | null;
  verbalizePoints: string[];
  takeaways: string[];
};

export type MockSessionReport = {
  skillBreakdown: Array<{
    skill: string;
    questionCount: number;
    gradedCount: number;
    pendingCount: number;
    correctCount: number;
    accuracyPercent: number;
  }>;
  riskItems: Array<{
    questionId: string;
    prompt: string;
    skill: string;
    format: QuestionFormat;
    isBookmarked: boolean;
    noteBody: string | null;
    noteUpdatedAt: Date | null;
    status: "incorrect" | "pending_review" | "unanswered";
    rubricCriteria: SessionRubricCriterion[];
    focusPoints: string[];
    verbalizePoints: string[];
  }>;
  verbalizePoints: string[];
};

function uniqueStrings(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)),
  );
}

export function computeMockSessionReport(input: {
  questions: MockReportQuestionInput[];
}): MockSessionReport {
  const skillMap = new Map<
    string,
    {
      skill: string;
      questionCount: number;
      gradedCount: number;
      pendingCount: number;
      correctCount: number;
      totalScorePercent: number;
    }
  >();

  for (const question of input.questions) {
    const current = skillMap.get(question.skill) ?? {
      skill: question.skill,
      questionCount: 0,
      gradedCount: 0,
      pendingCount: 0,
      correctCount: 0,
      totalScorePercent: 0,
    };

    current.questionCount += 1;
    if (question.scorePercent !== null) {
      current.gradedCount += 1;
      current.totalScorePercent += question.scorePercent;
    }
    if (question.attempted && question.isCorrect === null) {
      current.pendingCount += 1;
    }
    if (question.isCorrect) {
      current.correctCount += 1;
    }

    skillMap.set(question.skill, current);
  }

  const skillBreakdown = [...skillMap.values()]
    .map((skill) => ({
      skill: skill.skill,
      questionCount: skill.questionCount,
      gradedCount: skill.gradedCount,
      pendingCount: skill.pendingCount,
      correctCount: skill.correctCount,
      accuracyPercent:
        skill.gradedCount > 0
          ? Math.round(skill.totalScorePercent / skill.gradedCount)
          : 0,
    }))
    .sort((left, right) => {
      if (left.accuracyPercent !== right.accuracyPercent) {
        return left.accuracyPercent - right.accuracyPercent;
      }

      if (right.questionCount !== left.questionCount) {
        return right.questionCount - left.questionCount;
      }

      return left.skill.localeCompare(right.skill);
    });

  const riskItems = input.questions
    .filter((question) => question.isCorrect !== true)
    .map((question) => {
      const rubric = buildSessionRubric({
        format: question.format,
        verbalizePoints: question.verbalizePoints,
        takeaways: question.takeaways,
      });

      return {
        questionId: question.questionId,
        prompt: question.prompt,
        skill: question.skill,
        format: question.format,
        isBookmarked: question.isBookmarked,
        noteBody: question.noteBody,
        noteUpdatedAt: question.noteUpdatedAt,
        status: (question.isCorrect === false
          ? "incorrect"
          : question.attempted
            ? "pending_review"
            : "unanswered") as "incorrect" | "pending_review" | "unanswered",
        rubricCriteria: rubric.criteria,
        focusPoints: rubric.focusPoints,
        verbalizePoints: uniqueStrings(question.verbalizePoints).slice(0, 3),
      };
    })
    .sort((left, right) => {
      if (left.status !== right.status) {
        const statusRank = {
          incorrect: 0,
          pending_review: 1,
          unanswered: 2,
        } as const;

        return statusRank[left.status] - statusRank[right.status];
      }

      return left.prompt.localeCompare(right.prompt);
    })
    .slice(0, 4);

  const verbalizePoints = uniqueStrings([
    ...riskItems.flatMap((item) => item.verbalizePoints),
    ...input.questions.flatMap((question) => question.verbalizePoints),
    ...input.questions.flatMap((question) => question.takeaways),
  ]).slice(0, 6);

  return {
    skillBreakdown,
    riskItems,
    verbalizePoints,
  };
}
