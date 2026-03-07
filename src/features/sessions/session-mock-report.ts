export type MockReportQuestionInput = {
  questionId: string;
  prompt: string;
  skill: string;
  isCorrect: boolean | null;
  verbalizePoints: string[];
  takeaways: string[];
};

export type MockSessionReport = {
  skillBreakdown: Array<{
    skill: string;
    questionCount: number;
    correctCount: number;
    accuracyPercent: number;
  }>;
  riskItems: Array<{
    questionId: string;
    prompt: string;
    skill: string;
    status: "incorrect" | "unanswered";
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
      correctCount: number;
    }
  >();

  for (const question of input.questions) {
    const current = skillMap.get(question.skill) ?? {
      skill: question.skill,
      questionCount: 0,
      correctCount: 0,
    };

    current.questionCount += 1;
    if (question.isCorrect) {
      current.correctCount += 1;
    }

    skillMap.set(question.skill, current);
  }

  const skillBreakdown = [...skillMap.values()]
    .map((skill) => ({
      ...skill,
      accuracyPercent:
        skill.questionCount > 0
          ? Math.round((skill.correctCount / skill.questionCount) * 100)
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
    .map((question) => ({
      questionId: question.questionId,
      prompt: question.prompt,
      skill: question.skill,
      status: (question.isCorrect === false
        ? "incorrect"
        : "unanswered") as "incorrect" | "unanswered",
      verbalizePoints: uniqueStrings(question.verbalizePoints).slice(0, 3),
    }))
    .sort((left, right) => {
      if (left.status !== right.status) {
        return left.status === "incorrect" ? -1 : 1;
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
