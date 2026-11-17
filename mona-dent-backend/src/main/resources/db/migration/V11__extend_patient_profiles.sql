CREATE SEQUENCE patient_number_seq START WITH 1;

ALTER TABLE patients
    ADD COLUMN patient_number BIGINT,
    ADD COLUMN gender VARCHAR(6),
    ADD COLUMN home_address VARCHAR(255),
    ADD COLUMN allergies TEXT,
    ADD COLUMN diseases TEXT,
    ADD COLUMN profession VARCHAR(150);

WITH numbered_patients AS (
    SELECT id, row_number() OVER (ORDER BY created_at, id) AS patient_number
    FROM patients
)
UPDATE patients AS patient
SET patient_number = numbered_patients.patient_number
FROM numbered_patients
WHERE patient.id = numbered_patients.id;

SELECT setval('patient_number_seq', COALESCE(MAX(patient_number), 0) + 1, false)
FROM patients;

ALTER TABLE patients
    ALTER COLUMN patient_number SET DEFAULT nextval('patient_number_seq'),
    ALTER COLUMN patient_number SET NOT NULL,
    ADD CONSTRAINT uq_patients_patient_number UNIQUE (patient_number),
    ADD CONSTRAINT chk_patient_gender CHECK (gender IS NULL OR gender IN ('MALE', 'FEMALE'));

ALTER SEQUENCE patient_number_seq OWNED BY patients.patient_number;
