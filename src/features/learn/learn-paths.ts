export type LearnSurfaceMode = "public" | "dashboard";

export function getLearnLibraryHref(mode: LearnSurfaceMode) {
  return mode === "dashboard" ? "/dashboard/learn" : "/learn";
}

export function getLearnCollectionHref(mode: LearnSurfaceMode, slug: string) {
  return `${getLearnLibraryHref(mode)}/collections/${slug}`;
}

export function getLearnQuestionHref(mode: LearnSurfaceMode, slug: string) {
  return `${getLearnLibraryHref(mode)}/questions/${slug}`;
}
