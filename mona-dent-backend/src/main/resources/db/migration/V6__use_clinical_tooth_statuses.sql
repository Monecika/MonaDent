ALTER TABLE patient_teeth
    DROP CONSTRAINT IF EXISTS chk_tooth_status,
    DROP CONSTRAINT IF EXISTS chk_tooth_presence_status;

UPDATE patient_teeth
SET status = CASE presence_status
                 WHEN 'EXTRACTED' THEN 'EXTRACTED'
                 WHEN 'CONGENITALLY_MISSING' THEN 'MISSING'
                 ELSE status
    END;

ALTER TABLE patient_teeth
    ADD CONSTRAINT chk_tooth_status CHECK (status IN ('NOT_ASSESSED',
                                                      'HEALTHY',
                                                      'CARIES_ACTIVE',
                                                      'CARIES_TREATED',
                                                      'ROOT_PROBLEM',
                                                      'ROOT_TREATED',
                                                      'IMPLANT',
                                                      'CROWN',
                                                      'EXTRACTED',
                                                      'MISSING')),
    DROP COLUMN presence_status;

ALTER TABLE tooth_history
    DROP CONSTRAINT IF EXISTS chk_tooth_history_old_status,
    DROP CONSTRAINT IF EXISTS chk_tooth_history_new_status;

UPDATE tooth_history
SET old_status = CASE old_presence_status
                     WHEN 'EXTRACTED' THEN 'EXTRACTED'
                     WHEN 'CONGENITALLY_MISSING' THEN 'MISSING'
                     ELSE old_status
    END,
    new_status = CASE new_presence_status
                     WHEN 'EXTRACTED' THEN 'EXTRACTED'
                     WHEN 'CONGENITALLY_MISSING' THEN 'MISSING'
                     ELSE new_status
    END;

ALTER TABLE tooth_history
    ADD CONSTRAINT chk_tooth_history_old_status CHECK (old_status IN ('NOT_ASSESSED',
                                                                      'HEALTHY',
                                                                      'CARIES_ACTIVE',
                                                                      'CARIES_TREATED',
                                                                      'ROOT_PROBLEM',
                                                                      'ROOT_TREATED',
                                                                      'IMPLANT',
                                                                      'CROWN',
                                                                      'EXTRACTED',
                                                                      'MISSING')),
    ADD CONSTRAINT chk_tooth_history_new_status CHECK (new_status IN ('NOT_ASSESSED',
                                                                      'HEALTHY',
                                                                      'CARIES_ACTIVE',
                                                                      'CARIES_TREATED',
                                                                      'ROOT_PROBLEM',
                                                                      'ROOT_TREATED',
                                                                      'IMPLANT',
                                                                      'CROWN',
                                                                      'EXTRACTED',
                                                                      'MISSING')),
    DROP COLUMN old_presence_status,
    DROP COLUMN new_presence_status;
