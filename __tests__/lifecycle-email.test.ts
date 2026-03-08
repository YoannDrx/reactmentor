import { ContentLocale, Track } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  operationalEventCreateMock,
  operationalEventFindFirstMock,
  productAnalyticsEventFindFirstMock,
  questionProgressCountMock,
  questionProgressFindFirstMock,
  questionProgressFindManyMock,
  resendSendMock,
  userFindUniqueMock,
  isResendConfiguredMock,
} = vi.hoisted(() => ({
  operationalEventCreateMock: vi.fn(),
  operationalEventFindFirstMock: vi.fn(),
  productAnalyticsEventFindFirstMock: vi.fn(),
  questionProgressCountMock: vi.fn(),
  questionProgressFindFirstMock: vi.fn(),
  questionProgressFindManyMock: vi.fn(),
  resendSendMock: vi.fn(),
  userFindUniqueMock: vi.fn(),
  isResendConfiguredMock: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  env: {
    EMAIL_FROM: "React Mentor <noreply@reactmentor.dev>",
    LIFECYCLE_JOB_SECRET: "job_secret_test",
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    operationalEvent: {
      create: operationalEventCreateMock,
      findFirst: operationalEventFindFirstMock,
    },
    productAnalyticsEvent: {
      findFirst: productAnalyticsEventFindFirstMock,
    },
    questionProgress: {
      count: questionProgressCountMock,
      findFirst: questionProgressFindFirstMock,
      findMany: questionProgressFindManyMock,
    },
    user: {
      findUnique: userFindUniqueMock,
    },
  },
}));

vi.mock("@/lib/resend", () => ({
  getResendServerClient: () => ({
    emails: {
      send: resendSendMock,
    },
  }),
  isResendConfigured: isResendConfiguredMock,
}));

vi.mock("@/lib/server-url", () => ({
  getServerUrl: () => "https://reactmentor.dev",
}));

import {
  runReviewDueReminderJob,
  sendWelcomeLifecycleEmail,
} from "@/features/emails/lifecycle-email";

describe("lifecycle email", () => {
  beforeEach(() => {
    operationalEventCreateMock.mockReset();
    operationalEventFindFirstMock.mockReset();
    productAnalyticsEventFindFirstMock.mockReset();
    questionProgressCountMock.mockReset();
    questionProgressFindFirstMock.mockReset();
    questionProgressFindManyMock.mockReset();
    resendSendMock.mockReset();
    userFindUniqueMock.mockReset();
    isResendConfiguredMock.mockReset();

    isResendConfiguredMock.mockReturnValue(true);
  });

  it("sends the welcome email once and records the send", async () => {
    operationalEventFindFirstMock.mockResolvedValue(null);
    resendSendMock.mockResolvedValue({
      data: {
        id: "email_1",
      },
      error: null,
    });

    await sendWelcomeLifecycleEmail({
      userId: "user_1",
      recipient: "john@example.com",
      userName: "John Doe",
      locale: "fr",
      targetRole: "Senior Frontend Engineer",
      preferredTracks: [Track.REACT, Track.TYPESCRIPT],
      lifecycleEmailsEnabled: true,
    });

    expect(resendSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "React Mentor <noreply@reactmentor.dev>",
        to: ["john@example.com"],
        subject: "React Mentor est pret pour ton prochain cycle d'entretien",
        html: expect.stringContaining("Ta boucle de preparation est prete."),
        text: expect.stringContaining("https://reactmentor.dev/dashboard"),
      }),
    );
    expect(operationalEventCreateMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user_1",
        source: "email.lifecycle",
        eventType: "welcome_email",
        status: "sent",
      }),
    });
  });

  it("builds a dry-run review reminder batch without calling the provider", async () => {
    questionProgressFindManyMock.mockResolvedValue([
      {
        userId: "user_2",
      },
    ]);
    userFindUniqueMock.mockResolvedValue({
      id: "user_2",
      name: "Jane Doe",
      email: "jane@example.com",
      preferences: {
        lifecycleEmailsEnabled: true,
      },
    });
    operationalEventFindFirstMock.mockResolvedValue(null);
    questionProgressCountMock.mockResolvedValue(3);
    productAnalyticsEventFindFirstMock.mockResolvedValue({
      locale: ContentLocale.EN,
    });
    questionProgressFindFirstMock.mockResolvedValue({
      question: {
        module: {
          id: "module_1",
          slug: "react-rendering-systems",
          translations: [
            {
              locale: ContentLocale.FR,
              title: "Systemes de rendu React",
              description: "fr",
              summary: "fr",
            },
            {
              locale: ContentLocale.EN,
              title: "React Rendering Systems",
              description: "en",
              summary: "en",
            },
          ],
        },
        primarySkill: {
          id: "skill_1",
          slug: "rendering-mental-model",
          translations: [
            {
              locale: ContentLocale.FR,
              title: "Modele mental du rendu",
              description: "fr",
            },
            {
              locale: ContentLocale.EN,
              title: "Rendering mental model",
              description: "en",
            },
          ],
        },
      },
    });

    const result = await runReviewDueReminderJob({
      dryRun: true,
      limit: 10,
    });

    expect(result).toEqual(
      expect.objectContaining({
        candidateUsers: 1,
        attempted: 1,
        sent: 0,
        dryRunCount: 1,
        failed: 0,
        skipped: 0,
      }),
    );
    expect(resendSendMock).not.toHaveBeenCalled();
    expect(operationalEventCreateMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: "user_2",
        source: "email.lifecycle",
        eventType: "review_due_email",
        status: "dry_run",
      }),
    });
  });

  it("renders review reminders with the review queue and settings links", async () => {
    questionProgressFindManyMock.mockResolvedValue([
      {
        userId: "user_2",
      },
    ]);
    userFindUniqueMock.mockResolvedValue({
      id: "user_2",
      name: "Jane Doe",
      email: "jane@example.com",
      preferences: {
        lifecycleEmailsEnabled: true,
      },
    });
    operationalEventFindFirstMock.mockResolvedValue(null);
    questionProgressCountMock.mockResolvedValue(3);
    productAnalyticsEventFindFirstMock.mockResolvedValue({
      locale: ContentLocale.EN,
    });
    questionProgressFindFirstMock.mockResolvedValue({
      question: {
        module: {
          id: "module_1",
          slug: "react-rendering-systems",
          translations: [
            {
              locale: ContentLocale.FR,
              title: "Systemes de rendu React",
              description: "fr",
              summary: "fr",
            },
            {
              locale: ContentLocale.EN,
              title: "React Rendering Systems",
              description: "en",
              summary: "en",
            },
          ],
        },
        primarySkill: {
          id: "skill_1",
          slug: "rendering-mental-model",
          translations: [
            {
              locale: ContentLocale.FR,
              title: "Modele mental du rendu",
              description: "fr",
            },
            {
              locale: ContentLocale.EN,
              title: "Rendering mental model",
              description: "en",
            },
          ],
        },
      },
    });
    resendSendMock.mockResolvedValue({
      data: {
        id: "email_2",
      },
      error: null,
    });

    const result = await runReviewDueReminderJob({
      dryRun: false,
      limit: 10,
    });

    expect(result).toEqual(
      expect.objectContaining({
        attempted: 1,
        sent: 1,
        failed: 0,
      }),
    );
    expect(resendSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["jane@example.com"],
        subject: "3 review cards are ready to revisit",
        html: expect.stringContaining(
          "Your review queue is back on the critical path.",
        ),
        text: expect.stringContaining(
          "https://reactmentor.dev/dashboard/review",
        ),
      }),
    );
    expect(resendSendMock).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining(
          "https://reactmentor.dev/dashboard/settings",
        ),
      }),
    );
  });
});
