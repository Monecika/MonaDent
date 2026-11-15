ALTER TABLE patient_teeth
    ADD COLUMN findings JSONB,
    ADD COLUMN mobility_grade INTEGER;

UPDATE patient_teeth
SET findings = CASE status
    WHEN 'NOT_ASSESSED' THEN '["NOT_ASSESSED"]'::jsonb
    WHEN 'HEALTHY' THEN '["HEALTHY"]'::jsonb
    WHEN 'CARIES_ACTIVE' THEN '["CARIES"]'::jsonb
    WHEN 'CARIES_TREATED' THEN '["FILLING"]'::jsonb
    WHEN 'ROOT_PROBLEM' THEN '["ROOT_PROBLEM"]'::jsonb
    WHEN 'ROOT_TREATED' THEN '["FILLING"]'::jsonb
    WHEN 'IMPLANT' THEN '["IMPLANT"]'::jsonb
    WHEN 'CROWN' THEN '["CROWN"]'::jsonb
    WHEN 'MISSING' THEN '["MISSING"]'::jsonb
    WHEN 'EXTRACTED' THEN '["MISSING"]'::jsonb
    ELSE '["NOT_ASSESSED"]'::jsonb
END;

ALTER TABLE patient_teeth
    ALTER COLUMN findings SET NOT NULL,
    ADD CONSTRAINT chk_patient_tooth_findings_array CHECK (jsonb_typeof(findings) = 'array'),
    ADD CONSTRAINT chk_patient_tooth_findings_compatible CHECK (
        (NOT (findings ? 'NOT_ASSESSED') OR jsonb_array_length(findings) = 1)
        AND (NOT (findings ? 'MISSING') OR jsonb_array_length(findings) = 1)
        AND (NOT (findings ? 'HEALTHY') OR NOT (findings ?| ARRAY[
            'CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM'
        ]))
        AND (NOT (findings ? 'IMPLANT') OR NOT (findings ?| ARRAY[
            'CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM', 'FILLING', 'CROWN'
        ]))
    ),
    ADD CONSTRAINT chk_patient_tooth_mobility_grade CHECK (
        (mobility_grade IS NULL OR mobility_grade BETWEEN 1 AND 3)
        AND (mobility_grade IS NULL OR NOT (findings ? 'MISSING'))
    ),
    DROP COLUMN status;

ALTER TABLE tooth_history
    ADD COLUMN old_findings JSONB,
    ADD COLUMN new_findings JSONB,
    ADD COLUMN old_mobility_grade INTEGER,
    ADD COLUMN new_mobility_grade INTEGER;

UPDATE tooth_history
SET old_findings = CASE old_status
        WHEN 'NOT_ASSESSED' THEN '["NOT_ASSESSED"]'::jsonb
        WHEN 'HEALTHY' THEN '["HEALTHY"]'::jsonb
        WHEN 'CARIES_ACTIVE' THEN '["CARIES"]'::jsonb
        WHEN 'CARIES_TREATED' THEN '["FILLING"]'::jsonb
        WHEN 'ROOT_PROBLEM' THEN '["ROOT_PROBLEM"]'::jsonb
        WHEN 'ROOT_TREATED' THEN '["FILLING"]'::jsonb
        WHEN 'IMPLANT' THEN '["IMPLANT"]'::jsonb
        WHEN 'CROWN' THEN '["CROWN"]'::jsonb
        WHEN 'MISSING' THEN '["MISSING"]'::jsonb
        WHEN 'EXTRACTED' THEN '["MISSING"]'::jsonb
        ELSE '["NOT_ASSESSED"]'::jsonb
    END,
    new_findings = CASE new_status
        WHEN 'NOT_ASSESSED' THEN '["NOT_ASSESSED"]'::jsonb
        WHEN 'HEALTHY' THEN '["HEALTHY"]'::jsonb
        WHEN 'CARIES_ACTIVE' THEN '["CARIES"]'::jsonb
        WHEN 'CARIES_TREATED' THEN '["FILLING"]'::jsonb
        WHEN 'ROOT_PROBLEM' THEN '["ROOT_PROBLEM"]'::jsonb
        WHEN 'ROOT_TREATED' THEN '["FILLING"]'::jsonb
        WHEN 'IMPLANT' THEN '["IMPLANT"]'::jsonb
        WHEN 'CROWN' THEN '["CROWN"]'::jsonb
        WHEN 'MISSING' THEN '["MISSING"]'::jsonb
        WHEN 'EXTRACTED' THEN '["MISSING"]'::jsonb
        ELSE '["NOT_ASSESSED"]'::jsonb
    END;

ALTER TABLE tooth_history
    ALTER COLUMN old_findings SET NOT NULL,
    ALTER COLUMN new_findings SET NOT NULL,
    ADD CONSTRAINT chk_tooth_history_findings_arrays CHECK (
        jsonb_typeof(old_findings) = 'array' AND jsonb_typeof(new_findings) = 'array'
    ),
    ADD CONSTRAINT chk_tooth_history_old_mobility_grade CHECK (old_mobility_grade IS NULL OR old_mobility_grade BETWEEN 1 AND 3),
    ADD CONSTRAINT chk_tooth_history_new_mobility_grade CHECK (new_mobility_grade IS NULL OR new_mobility_grade BETWEEN 1 AND 3),
    DROP COLUMN old_status,
    DROP COLUMN new_status;
