-- Recover installations where an earlier baseline recorded the schema as
-- current even though the appointments table was absent.
CREATE TABLE IF NOT EXISTS appointments
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

CREATE INDEX IF NOT EXISTS idx_appointments_branch_date ON appointments (branch_id, appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments (patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_employee_id ON appointments (employee_id);
