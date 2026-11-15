CREATE OR REPLACE FUNCTION seed_patient_dental_chart(target_patient_id UUID, target_birth_date DATE)
    RETURNS VOID
    LANGUAGE plpgsql
AS
$$
DECLARE
    patient_age INTEGER;
BEGIN
    IF target_birth_date > CURRENT_DATE THEN
        RAISE EXCEPTION 'Date of birth cannot be in the future'
            USING ERRCODE = '22007';
    END IF;

    patient_age := EXTRACT(YEAR FROM age(CURRENT_DATE, target_birth_date));

    IF patient_age <= 5 THEN
        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PRIMARY'
        FROM generate_series(5, 8) AS q(quadrant)
                 CROSS JOIN generate_series(1, 5) AS p(position);
    ELSIF patient_age <= 9 THEN
        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PRIMARY'
        FROM generate_series(5, 8) AS q(quadrant)
                 CROSS JOIN (VALUES (3), (4), (5)) AS p(position);

        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PERMANENT'
        FROM generate_series(1, 4) AS q(quadrant)
                 CROSS JOIN (VALUES (1), (2), (6)) AS p(position);
    ELSIF patient_age <= 17 THEN
        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PERMANENT'
        FROM generate_series(1, 4) AS q(quadrant)
                 CROSS JOIN generate_series(1, 7) AS p(position);
    ELSE
        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PERMANENT'
        FROM generate_series(1, 4) AS q(quadrant)
                 CROSS JOIN generate_series(1, 8) AS p(position);
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION initialize_patient_dental_chart()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    PERFORM seed_patient_dental_chart(NEW.id, NEW.date_of_birth);
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION refresh_unmodified_patient_dental_chart()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS
$$
BEGIN
    IF NEW.date_of_birth IS NOT DISTINCT FROM OLD.date_of_birth THEN
        RETURN NEW;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM patient_teeth
        WHERE patient_id = NEW.id AND updated_by IS NOT NULL
    ) OR EXISTS (
        SELECT 1
        FROM tooth_history history
                 JOIN patient_teeth tooth ON tooth.id = history.patient_tooth_id
        WHERE tooth.patient_id = NEW.id
    ) THEN
        RETURN NEW;
    END IF;

    DELETE FROM patient_teeth WHERE patient_id = NEW.id;
    PERFORM seed_patient_dental_chart(NEW.id, NEW.date_of_birth);
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_refresh_unmodified_patient_dental_chart
    AFTER UPDATE OF date_of_birth
    ON patients
    FOR EACH ROW
EXECUTE FUNCTION refresh_unmodified_patient_dental_chart();
