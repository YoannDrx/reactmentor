import {
  MasteryState,
  QuestionLevel,
  SessionMode,
  Track,
} from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type ActiveSessionFixture = {
  id: string;
  mode: SessionMode;
  startedAt: Date;
  config: {
    source: "module" | "mock_template";
    locale: "fr" | "en";
    questionCount: number;
    moduleSlug?: string;
    tracks?: Track[];
    level?: QuestionLevel;
    templateKey?: string;
  };
};

type QuestionCandidateFixture = {
  id: string;
  difficulty: number;
  progress: Array<{
    masteryState: MasteryState;
    lastAttemptAt: Date | null;
  }>;
  attempts: Array<{
    createdAt: Date;
  }>;
};

type ReviewCandidateFixture = {
  questionId: string;
  masteryState: MasteryState;
  nextReviewAt: Date | null;
  lastAttemptAt: Date | null;
  question: {
    difficulty: number;
  };
};

const {
  transactionMock,
  trainingSessionFindManyMock,
  questionFindManyMock,
  questionProgressFindManyMock,
  trainingSessionCreateMock,
  trainingSessionItemCreateManyMock,
} = vi.hoisted(() => ({
  transactionMock: vi.fn(),
  trainingSessionFindManyMock: vi.fn<() => Promise<ActiveSessionFixture[]>>(
    () => Promise.resolve([]),
  ),
  questionFindManyMock: vi.fn<() => Promise<QuestionCandidateFixture[]>>(() =>
    Promise.resolve([]),
  ),
  questionProgressFindManyMock: vi.fn<() => Promise<ReviewCandidateFixture[]>>(
    () => Promise.resolve([]),
  ),
  trainingSessionCreateMock: vi.fn(
    ({ data }: { data: { mode: SessionMode } }) =>
      Promise.resolve({
        id: "session_created",
        mode: data.mode,
      }),
  ),
  trainingSessionItemCreateManyMock: vi.fn(() => Promise.resolve({ count: 0 })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: transactionMock,
    trainingSession: {
      findMany: trainingSessionFindManyMock,
    },
    question: {
      findMany: questionFindManyMock,
      count: vi.fn(),
    },
    questionProgress: {
      findMany: questionProgressFindManyMock,
    },
  },
}));

import { createTrainingSession } from "@/features/sessions/session-builder";

describe("createTrainingSession", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-07T12:00:00.000Z"));

    trainingSessionFindManyMock.mockReset();
    trainingSessionFindManyMock.mockResolvedValue([]);
    questionFindManyMock.mockReset();
    questionFindManyMock.mockResolvedValue([]);
    questionProgressFindManyMock.mockReset();
    questionProgressFindManyMock.mockResolvedValue([]);
    trainingSessionCreateMock.mockReset();
    trainingSessionCreateMock.mockImplementation(
      ({ data }: { data: { mode: SessionMode } }) =>
        Promise.resolve({
          id: "session_created",
          mode: data.mode,
        }),
    );
    trainingSessionItemCreateManyMock.mockReset();
    trainingSessionItemCreateManyMock.mockResolvedValue({ count: 0 });
    transactionMock.mockReset();
    transactionMock.mockImplementation(async (callback) =>
      callback({
        trainingSession: {
          create: trainingSessionCreateMock,
        },
        trainingSessionItem: {
          createMany: trainingSessionItemCreateManyMock,
        },
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resumes an existing active session when the config matches the request", async () => {
    trainingSessionFindManyMock.mockResolvedValue([
      {
        id: "session_existing",
        mode: SessionMode.PRACTICE,
        startedAt: new Date("2026-03-07T10:00:00.000Z"),
        config: {
          source: "module",
          locale: "fr",
          questionCount: 4,
          moduleSlug: "react-rendering-systems",
          tracks: [Track.REACT],
          level: QuestionLevel.MID,
        },
      },
    ]);

    const session = await createTrainingSession({
      userId: "user_1",
      mode: SessionMode.PRACTICE,
      locale: "fr",
      questionCount: 4,
      moduleSlug: "react-rendering-systems",
      tracks: [Track.REACT],
      level: QuestionLevel.MID,
    });

    expect(session).toMatchObject({
      id: "session_existing",
      resumed: true,
      questionCount: 4,
      mode: SessionMode.PRACTICE,
      config: {
        source: "module",
        moduleSlug: "react-rendering-systems",
        level: QuestionLevel.MID,
      },
    });
    expect(questionFindManyMock).not.toHaveBeenCalled();
    expect(transactionMock).not.toHaveBeenCalled();
  });

  it("prioritizes weaker or unseen questions when composing a new practice session", async () => {
    questionFindManyMock.mockResolvedValue([
      {
        id: "question_mastered_recent",
        difficulty: 1,
        progress: [
          {
            masteryState: MasteryState.MASTERED,
            lastAttemptAt: new Date("2026-03-06T12:00:00.000Z"),
          },
        ],
        attempts: [
          {
            createdAt: new Date("2026-03-06T12:00:00.000Z"),
          },
        ],
      },
      {
        id: "question_learning",
        difficulty: 3,
        progress: [
          {
            masteryState: MasteryState.LEARNING,
            lastAttemptAt: new Date("2026-03-01T12:00:00.000Z"),
          },
        ],
        attempts: [
          {
            createdAt: new Date("2026-03-01T12:00:00.000Z"),
          },
        ],
      },
      {
        id: "question_new",
        difficulty: 2,
        progress: [],
        attempts: [],
      },
    ]);

    const session = await createTrainingSession({
      userId: "user_1",
      mode: SessionMode.PRACTICE,
      locale: "en",
      questionCount: 2,
      moduleSlug: "react-rendering-systems",
      tracks: [Track.REACT],
      level: QuestionLevel.MID,
    });

    expect(session).toMatchObject({
      id: "session_created",
      resumed: false,
      questionCount: 2,
      config: {
        source: "module",
        locale: "en",
        moduleSlug: "react-rendering-systems",
        level: QuestionLevel.MID,
      },
    });
    expect(trainingSessionCreateMock).toHaveBeenCalledWith({
      data: {
        userId: "user_1",
        mode: SessionMode.PRACTICE,
        config: expect.objectContaining({
          source: "module",
          locale: "en",
          questionCount: 2,
          moduleSlug: "react-rendering-systems",
          tracks: [Track.REACT],
          level: QuestionLevel.MID,
          templateKey: null,
        }),
      },
    });
    expect(trainingSessionItemCreateManyMock).toHaveBeenCalledWith({
      data: [
        {
          sessionId: "session_created",
          questionId: "question_new",
          order: 1,
        },
        {
          sessionId: "session_created",
          questionId: "question_learning",
          order: 2,
        },
      ],
    });
  });

  it("builds review sessions from due question progress instead of the practice pool", async () => {
    questionProgressFindManyMock.mockResolvedValue([
      {
        questionId: "question_due_recent",
        masteryState: MasteryState.REVIEWING,
        nextReviewAt: new Date("2026-03-06T12:00:00.000Z"),
        lastAttemptAt: new Date("2026-03-05T12:00:00.000Z"),
        question: {
          difficulty: 2,
        },
      },
      {
        questionId: "question_due_critical",
        masteryState: MasteryState.LEARNING,
        nextReviewAt: new Date("2026-03-03T12:00:00.000Z"),
        lastAttemptAt: new Date("2026-03-01T12:00:00.000Z"),
        question: {
          difficulty: 3,
        },
      },
    ]);

    const session = await createTrainingSession({
      userId: "user_1",
      mode: SessionMode.REVIEW,
      locale: "fr",
      questionCount: 2,
      tracks: [Track.REACT],
      level: QuestionLevel.MID,
    });

    expect(session).toMatchObject({
      id: "session_created",
      resumed: false,
      mode: SessionMode.REVIEW,
      questionCount: 2,
      config: {
        locale: "fr",
        tracks: [Track.REACT],
        level: QuestionLevel.MID,
      },
    });
    expect(questionFindManyMock).not.toHaveBeenCalled();
    expect(questionProgressFindManyMock).toHaveBeenCalledTimes(1);
    expect(trainingSessionItemCreateManyMock).toHaveBeenCalledWith({
      data: [
        {
          sessionId: "session_created",
          questionId: "question_due_critical",
          order: 1,
        },
        {
          sessionId: "session_created",
          questionId: "question_due_recent",
          order: 2,
        },
      ],
    });
  });

  it("throws when no playable question matches the requested session scope", async () => {
    questionFindManyMock.mockResolvedValue([]);

    await expect(
      createTrainingSession({
        userId: "user_1",
        mode: SessionMode.PRACTICE,
        locale: "fr",
        questionCount: 5,
        moduleSlug: "react-rendering-systems",
        tracks: [Track.REACT],
        level: QuestionLevel.MID,
      }),
    ).rejects.toThrow("No questions are available for this session.");

    expect(transactionMock).not.toHaveBeenCalled();
  });
});
