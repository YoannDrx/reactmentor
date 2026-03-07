import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleBookmarkAction } from "./bookmark.action";

export function BookmarkToggleForm(params: {
  questionId: string;
  isBookmarked: boolean;
  pathToRevalidate: string;
  saveLabel: string;
  removeLabel: string;
  variant?: "primary" | "secondary" | "ghost" | "dark";
}) {
  return (
    <form action={toggleBookmarkAction}>
      <input type="hidden" name="questionId" value={params.questionId} />
      <input
        type="hidden"
        name="pathToRevalidate"
        value={params.pathToRevalidate}
      />
      <Button type="submit" variant={params.variant ?? "ghost"} size="sm">
        {params.isBookmarked ? (
          <BookmarkCheck className="size-4" />
        ) : (
          <Bookmark className="size-4" />
        )}
        {params.isBookmarked ? params.removeLabel : params.saveLabel}
      </Button>
    </form>
  );
}
