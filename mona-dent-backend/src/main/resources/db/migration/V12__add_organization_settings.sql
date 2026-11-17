CREATE TABLE organization_settings
(
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(200) NOT NULL DEFAULT '',
    idno          VARCHAR(50)  NOT NULL DEFAULT ''
);

INSERT INTO organization_settings (name, idno)
VALUES ('', '');
