import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { mockAuthClient, mockRouter, mockToast } from "./mocks";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");

  return {
    ...actual,
    useRouter: () => mockRouter,
    usePathname: () => "/",
  };
});

vi.mock("@/lib/auth-client", () => ({
  authClient: mockAuthClient,
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: mockToast,
}));

beforeEach(() => {
  Object.values(mockRouter).forEach((mock) => mock.mockReset());
  mockToast.error.mockReset();
  mockToast.success.mockReset();
  mockToast.info.mockReset();
  mockToast.warning.mockReset();
  mockAuthClient.signIn.email.mockReset();
  mockAuthClient.signIn.social.mockReset();
  mockAuthClient.signUp.email.mockReset();
});

afterEach(() => {
  cleanup();
});
