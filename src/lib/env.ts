import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const defaultDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/react_mentor?schema=public";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url().default(defaultDatabaseUrl),
    DATABASE_URL_UNPOOLED: z.string().url().default(defaultDatabaseUrl),
    BETTER_AUTH_SECRET: z
      .string()
      .min(1)
      .default("react-mentor-dev-secret-change-me"),
    BETTER_AUTH_URL: z.string().url().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    RESEND_AUDIENCE_ID: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    STRIPE_PRICE_MENTOR_PRO: z.string().optional(),
    STRIPE_PRICE_HIRING_SPRINT: z.string().optional(),
    EMAIL_FROM: z
      .string()
      .default("React Mentor <noreply@reactmentor.dev>"),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
