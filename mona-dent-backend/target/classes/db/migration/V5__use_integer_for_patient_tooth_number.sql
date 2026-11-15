-- The application maps PatientTooth.toothNumber as a Java Integer. Keep the
-- database column aligned so Hibernate schema validation succeeds for both
-- existing installations and fresh databases.
ALTER TABLE patient_teeth
    ALTER COLUMN tooth_number TYPE INTEGER
    USING tooth_number::INTEGER;
