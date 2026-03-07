ALTER TABLE "attempt"
    ALTER COLUMN "selectedOptionIds" SET DEFAULT ARRAY[]::TEXT[],
    ADD COLUMN "responseData" JSONB;

UPDATE "attempt"
SET "responseData" = jsonb_build_object(
    'kind',
    'option_selection',
    'selectedOptionIds',
    to_jsonb("selectedOptionIds")
)
WHERE "responseData" IS NULL;
