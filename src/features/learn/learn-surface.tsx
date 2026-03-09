import type { ReactNode } from "react";
import { LearnHeader } from "@/features/learn/learn-header";
import type { LearnSurfaceMode } from "./learn-paths";

export function LearnSurface(props: {
  mode: LearnSurfaceMode;
  children: ReactNode;
  header: {
    libraryLabel: string;
    signInLabel: string;
    createWorkspaceLabel: string;
    brandTagline: string;
  };
}) {
  if (props.mode === "public") {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#f6efe6_0%,#ffffff_22%,#eef7fb_100%)]">
        <LearnHeader
          libraryLabel={props.header.libraryLabel}
          signInLabel={props.header.signInLabel}
          createWorkspaceLabel={props.header.createWorkspaceLabel}
          brandTagline={props.header.brandTagline}
        />
        <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
          {props.children}
        </main>
      </div>
    );
  }

  return <div className="grid gap-8">{props.children}</div>;
}
