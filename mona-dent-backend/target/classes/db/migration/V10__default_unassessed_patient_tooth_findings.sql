ALTER TABLE patient_teeth
    ALTER COLUMN findings SET DEFAULT '["NOT_ASSESSED"]'::jsonb;
