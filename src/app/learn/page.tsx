import { BookOpenCheck, LibraryBig, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { LearnHeader } from "@/features/learn/learn-header";
import { getI18n } from "@/i18n/server";
import { getLocalizedQuestionCollections } from "@/lib/content-repository";

export default async function LearnPage() {
  const { locale, messages } = await getI18n();
  const learn = messages.learn;
  const common = messages.common;
  const collections = await getLocalizedQuestionCollections(locale);
  const totalQuestionsCount = collections.reduce(
    (sum, collection) => sum + collection.counts.questions,
    0,
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6efe6_0%,#ffffff_22%,#eef7fb_100%)]">
      <LearnHeader
        libraryLabel={learn.index.badge}
        signInLabel={common.actions.logIn}
        createWorkspaceLabel={common.actions.createWorkspace}
        brandTagline={common.brandTagline}
      />

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
                <Sparkles className="size-4" />
                {learn.index.badge}
              </div>
              <div className="space-y-3">
                <CardTitle className="text-4xl text-slate-950">
                  {learn.index.title}
                </CardTitle>
                <CardDescription className="max-w-3xl text-base leading-8">
                  {learn.index.description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="border-slate-200 bg-slate-950 text-white">
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
                  <LibraryBig className="size-4" />
                  {learn.index.collectionsTitle}
                </div>
                <div className="font-display text-4xl font-semibold">
                  {collections.length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <BookOpenCheck className="size-4 text-cyan-600" />
                  {learn.index.questionCountLabel}
                </div>
                <div className="font-display text-4xl font-semibold text-slate-950">
                  {totalQuestionsCount}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-semibold text-slate-950">
              {learn.index.collectionsTitle}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600">
              {learn.index.collectionsDescription}
            </p>
          </div>

          {collections.length === 0 ? (
            <Card className="border-dashed border-slate-300 bg-white">
              <CardContent className="pt-6 text-sm leading-7 text-slate-600">
                <div className="font-medium text-slate-950">
                  {learn.index.emptyTitle}
                </div>
                <p className="mt-2">{learn.index.emptyDescription}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 xl:grid-cols-2">
              {collections.map((collection) => (
                <Card key={collection.id} className="border-slate-200 bg-white">
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle>{collection.title}</CardTitle>
                        <CardDescription>
                          {collection.description}
                        </CardDescription>
                      </div>
                      <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                        {collection.counts.questions}{" "}
                        {learn.index.questionCountLabel.toLowerCase()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-600">
                      {collection.summary ?? collection.description}
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        {learn.index.previewQuestionsLabel}
                      </div>
                      <div className="grid gap-3">
                        {collection.previewQuestions.map((question) => (
                          <div
                            key={question.id}
                            className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                          >
                            {question.prompt}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/learn/collections/${collection.slug}`}
                      className={buttonVariants({
                        variant: "primary",
                        size: "md",
                      })}
                    >
                      {learn.index.openCollection}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
