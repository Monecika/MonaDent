-- =====================================================================
-- Full schema for a fresh database (PostgreSQL 13+, uses gen_random_uuid()).
-- Includes the end state of:
--   V1__separate_tooth_condition_and_presence
--   V2__single_current_tooth_per_position
--   V3__tooth_history_events
-- Do NOT run V1-V3 on top of this; they are only for upgrading old databases.
-- =====================================================================


-- ---------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------

CREATE TABLE branches
(
    id         UUID PRIMARY KEY      DEFAULT gen_random_uuid(),
    name       VARCHAR(150) NOT NULL,
    address    VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TABLE ip_allowlist_entries
(
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL,
    ip_address VARCHAR(18) NOT NULL UNIQUE,

    CONSTRAINT chk_ip_allowlist_ipv4 CHECK (
        ip_address ~ '^([0-9]{1,3}\.){3}[0-9]{1,3}(/([0-9]|[12][0-9]|3[0-2]))?$'
            AND split_part(split_part(ip_address, '/', 1), '.', 1)::INTEGER BETWEEN 0 AND 255
            AND split_part(split_part(ip_address, '/', 1), '.', 2)::INTEGER BETWEEN 0 AND 255
            AND split_part(split_part(ip_address, '/', 1), '.', 3)::INTEGER BETWEEN 0 AND 255
            AND split_part(split_part(ip_address, '/', 1), '.', 4)::INTEGER BETWEEN 0 AND 255
        )
);

CREATE TABLE users
(
    id             UUID PRIMARY KEY      DEFAULT gen_random_uuid(),
    name           VARCHAR(100) NOT NULL,
    surname        VARCHAR(100) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    phone          VARCHAR(30)  NOT NULL UNIQUE,
    date_of_birth  DATE         NOT NULL,
    calendar_color VARCHAR(7),
    role           VARCHAR(30)  NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    status         VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE',
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ,

    CONSTRAINT chk_user_role CHECK (role IN ('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'ASSISTANT', 'MANAGER')),

    CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE', 'INACTIVE')),

    CONSTRAINT chk_calendar_color CHECK (calendar_color IS NULL OR calendar_color ~ '^#[0-9A-Fa-f]{6}$')
);

CREATE TABLE user_branches
(
    user_id   UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches (id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, branch_id)
);

CREATE TABLE patients
(
    id            UUID PRIMARY KEY      DEFAULT gen_random_uuid(),
    name          VARCHAR(100) NOT NULL,
    surname       VARCHAR(100) NOT NULL,
    date_of_birth DATE         NOT NULL,
    phone         VARCHAR(30)  NOT NULL,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMPTZ
);

CREATE TABLE appointments
(
    id               UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    branch_id        UUID        NOT NULL REFERENCES branches (id),
    patient_id       UUID        NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    employee_id      UUID        NOT NULL REFERENCES users (id),
    appointment_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER     NOT NULL,
    description      TEXT,
    notes            TEXT,
    status           VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ,

    CONSTRAINT chk_appointment_duration CHECK (duration_minutes > 0),

    CONSTRAINT chk_appointment_status CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'))
);

CREATE TABLE visits
(
    id               UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    branch_id        UUID        NOT NULL REFERENCES branches (id),
    patient_id       UUID        NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    doctor_id        UUID        NOT NULL REFERENCES users (id),
    appointment_id   UUID UNIQUE REFERENCES appointments (id) ON DELETE SET NULL,
    visit_date       TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER     NOT NULL DEFAULT 5,
    description      TEXT,
    notes            TEXT,
    status           VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    created_at       TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMPTZ,

    CONSTRAINT chk_visit_duration CHECK (duration_minutes > 0),

    CONSTRAINT chk_visit_status CHECK (status IN ('IN_PROGRESS', 'COMPLETED'))
);

CREATE TABLE patient_files
(
    id              UUID PRIMARY KEY      DEFAULT gen_random_uuid(),
    patient_id      UUID         NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    visit_id        UUID REFERENCES visits (id),
    uploaded_by     UUID         NOT NULL REFERENCES users (id),
    file_name       VARCHAR(255) NOT NULL,
    storage_key     VARCHAR(500) NOT NULL,
    content_type    VARCHAR(150),
    file_size_bytes BIGINT,
    description     TEXT,
    uploaded_at     TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ,

    CONSTRAINT chk_file_size CHECK (file_size_bytes IS NULL OR file_size_bytes >= 0)
);


-- ---------------------------------------------------------------------
-- Odontogram: current teeth with composable clinical findings
-- ---------------------------------------------------------------------

CREATE TABLE patient_teeth
(
    id              UUID PRIMARY KEY     DEFAULT gen_random_uuid(),
    patient_id      UUID        NOT NULL REFERENCES patients (id) ON DELETE CASCADE,
    tooth_number    INTEGER     NOT NULL,
    tooth_type      VARCHAR(20) NOT NULL,
    findings        JSONB       NOT NULL DEFAULT '["NOT_ASSESSED"]'::jsonb,
    mobility_grade  INTEGER,
    is_current      BOOLEAN     NOT NULL DEFAULT TRUE,
    notes           TEXT,
    updated_by      UUID REFERENCES users (id),
    updated_at      TIMESTAMPTZ,

    CONSTRAINT chk_tooth_type CHECK (tooth_type IN ('PRIMARY', 'PERMANENT')),

    CONSTRAINT chk_tooth_number CHECK (tooth_number IN (11, 12, 13, 14, 15, 16, 17, 18,
                                                        21, 22, 23, 24, 25, 26, 27, 28,
                                                        31, 32, 33, 34, 35, 36, 37, 38,
                                                        41, 42, 43, 44, 45, 46, 47, 48,
                                                        51, 52, 53, 54, 55,
                                                        61, 62, 63, 64, 65,
                                                        71, 72, 73, 74, 75,
                                                        81, 82, 83, 84, 85)),

    CONSTRAINT chk_patient_tooth_findings_array CHECK (jsonb_typeof(findings) = 'array'),
    CONSTRAINT chk_patient_tooth_findings_compatible CHECK (
        (NOT (findings ? 'NOT_ASSESSED') OR jsonb_array_length(findings) = 1)
        AND (NOT (findings ? 'MISSING') OR jsonb_array_length(findings) = 1)
        AND (NOT (findings ? 'HEALTHY') OR NOT (findings ?| ARRAY[
            'CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM'
        ]))
        AND (NOT (findings ? 'IMPLANT') OR NOT (findings ?| ARRAY[
            'CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM', 'FILLING', 'CROWN'
        ]))
    ),
    CONSTRAINT chk_patient_tooth_mobility_grade CHECK (
        (mobility_grade IS NULL OR mobility_grade BETWEEN 1 AND 3)
        AND (mobility_grade IS NULL OR NOT (findings ? 'MISSING'))
    )
);

-- One current tooth per position. Primary teeth 5x-8x map onto the permanent
-- quadrants 1x-4x (51 -> 11, 85 -> 45, ...), so a primary tooth and the permanent
-- tooth replacing it cannot both be current; the replaced one gets is_current = FALSE.
CREATE UNIQUE INDEX uq_patient_teeth_current_position
    ON patient_teeth (
                      patient_id,
                      (CASE
                           WHEN tooth_number / 10 BETWEEN 5 AND 8 THEN tooth_number / 10 - 4
                           ELSE tooth_number / 10
                          END),
                      (tooth_number % 10)
        )
    WHERE is_current;


-- ---------------------------------------------------------------------
-- Seed an age-appropriate dental chart
-- ---------------------------------------------------------------------

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
        -- Full primary dentition
        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PRIMARY'
        FROM generate_series(5, 8) AS q(quadrant)
                 CROSS JOIN generate_series(1, 5) AS p(position);
    ELSIF patient_age <= 9 THEN
        -- Mixed dentition: primary canines/molars (positions 3-5) + first permanent incisors and molars
        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PRIMARY'
        FROM generate_series(5, 8) AS q(quadrant)
                 CROSS JOIN (VALUES (3), (4), (5)) AS p(position);

        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PERMANENT'
        FROM generate_series(1, 4) AS q(quadrant)
                 CROSS JOIN (VALUES (1), (2), (6)) AS p(position);
    ELSIF patient_age <= 17 THEN
        -- Permanent teeth without wisdom teeth
        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PERMANENT'
        FROM generate_series(1, 4) AS q(quadrant)
                 CROSS JOIN generate_series(1, 7) AS p(position);
    ELSE
        -- Full permanent dentition
        INSERT INTO patient_teeth (patient_id, tooth_number, tooth_type)
        SELECT target_patient_id, q.quadrant * 10 + p.position, 'PERMANENT'
        FROM generate_series(1, 4) AS q(quadrant)
                 CROSS JOIN generate_series(1, 8) AS p(position);
    END IF;
END;
$$;

-- Auto-create the dental chart when a patient is inserted
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

CREATE TRIGGER trg_initialize_patient_dental_chart
    AFTER INSERT
    ON patients
    FOR EACH ROW
EXECUTE FUNCTION initialize_patient_dental_chart();

-- Rebuild only untouched auto-generated charts after a birthdate correction.
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
        SELECT 1 FROM patient_teeth
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


-- ---------------------------------------------------------------------
-- Odontogram: change history
-- ---------------------------------------------------------------------

CREATE TABLE tooth_history
(
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_tooth_id    UUID        NOT NULL REFERENCES patient_teeth (id) ON DELETE CASCADE,
    visit_id            UUID REFERENCES visits (id),
    old_findings        JSONB       NOT NULL DEFAULT '["NOT_ASSESSED"]'::jsonb,
    new_findings        JSONB       NOT NULL DEFAULT '["NOT_ASSESSED"]'::jsonb,
    old_mobility_grade  INTEGER,
    new_mobility_grade  INTEGER,
    event_type          VARCHAR(40),
    old_tooth_type      VARCHAR(20),
    new_tooth_type      VARCHAR(20),
    old_tooth_number    INTEGER,
    new_tooth_number    INTEGER,
    description         TEXT,
    notes               TEXT,
    changed_by          UUID        NOT NULL REFERENCES users (id),
    changed_at          TIMESTAMPTZ,

    CONSTRAINT chk_tooth_history_findings_arrays CHECK (
        jsonb_typeof(old_findings) = 'array' AND jsonb_typeof(new_findings) = 'array'
    ),
    CONSTRAINT chk_tooth_history_old_mobility_grade CHECK (old_mobility_grade IS NULL OR old_mobility_grade BETWEEN 1 AND 3),
    CONSTRAINT chk_tooth_history_new_mobility_grade CHECK (new_mobility_grade IS NULL OR new_mobility_grade BETWEEN 1 AND 3)
);


-- ---------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------

CREATE INDEX idx_appointments_branch_date ON appointments (branch_id, appointment_date);

CREATE INDEX idx_appointments_patient_id ON appointments (patient_id);

CREATE INDEX idx_appointments_employee_id ON appointments (employee_id);

CREATE INDEX idx_visits_patient_date ON visits (patient_id, visit_date);

CREATE INDEX idx_patient_files_patient_id ON patient_files (patient_id);

CREATE INDEX idx_tooth_history_tooth_changed ON tooth_history (patient_tooth_id, changed_at DESC);
