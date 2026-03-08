"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useMemo } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const copy = useMemo(() => {
    const isFrench =
      typeof document !== "undefined" &&
      document.documentElement.lang.toLowerCase().startsWith("fr");

    return isFrench
      ? {
          title: "Une erreur inattendue est survenue.",
          description:
            "Le probleme a ete remonte et tu peux relancer l'ecran pour reprendre le flux.",
          action: "Reessayer",
        }
      : {
          title: "Something went wrong.",
          description:
            "The issue has been reported and you can retry the screen to continue.",
          action: "Try again",
        };
  }, []);

  return (
    <html>
      <body className="bg-[rgb(251,247,240)] text-slate-950 antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-6 py-16">
          <div className="w-full rounded-[32px] border border-slate-200 bg-white/90 p-8 shadow-[0_32px_100px_-52px_rgba(15,23,42,0.35)]">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
              React Mentor
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              {copy.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {copy.description}
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="mt-6 inline-flex h-11 items-center rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {copy.action}
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
