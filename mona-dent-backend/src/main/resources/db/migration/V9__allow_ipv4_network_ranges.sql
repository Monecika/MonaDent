ALTER TABLE ip_allowlist_entries
    ALTER COLUMN ip_address TYPE VARCHAR(18);

ALTER TABLE ip_allowlist_entries
    DROP CONSTRAINT chk_ip_allowlist_ipv4;

ALTER TABLE ip_allowlist_entries
    ADD CONSTRAINT chk_ip_allowlist_ipv4 CHECK (
        ip_address ~ '^([0-9]{1,3}\.){3}[0-9]{1,3}(/([0-9]|[12][0-9]|3[0-2]))?$'
        AND split_part(split_part(ip_address, '/', 1), '.', 1)::INTEGER BETWEEN 0 AND 255
        AND split_part(split_part(ip_address, '/', 1), '.', 2)::INTEGER BETWEEN 0 AND 255
        AND split_part(split_part(ip_address, '/', 1), '.', 3)::INTEGER BETWEEN 0 AND 255
        AND split_part(split_part(ip_address, '/', 1), '.', 4)::INTEGER BETWEEN 0 AND 255
    );
