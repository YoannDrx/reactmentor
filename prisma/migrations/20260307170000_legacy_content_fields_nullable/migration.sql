-- Drop the runtime dependency on the legacy monolingual cache columns.
-- Translation tables remain the source of truth, so these base columns no longer
-- need to stay required while the final drop is deferred to a later cleanup.

ALTER TABLE "learning_module"
    ALTER COLUMN "title" DROP NOT NULL,
    ALTER COLUMN "description" DROP NOT NULL;

ALTER TABLE "skill"
    ALTER COLUMN "title" DROP NOT NULL,
    ALTER COLUMN "description" DROP NOT NULL;

ALTER TABLE "question"
    ALTER COLUMN "prompt" DROP NOT NULL,
    ALTER COLUMN "explanation" DROP NOT NULL;

ALTER TABLE "question_option"
    ALTER COLUMN "label" DROP NOT NULL,
    ALTER COLUMN "explanation" DROP NOT NULL;
