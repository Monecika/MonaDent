# MonaDent backend

This is the Java API for MonaDent, a dental clinic management application. It handles authentication and role-based access, clinic branches and users, appointments, patient records, visits, dental chart history, and patient files.

## Stack

The backend uses Java 17, Spring Boot, Spring Security with JWT authentication, PostgreSQL, and Flyway migrations. API contracts are maintained as OpenAPI files in `src/main/resources/contracts`; the endpoints are also described in [API.md](API.md).

## Run locally

Start PostgreSQL and create a database. Defaults are database `clinic_db`, username `mona`, and password `mona` on `localhost:5432`. Override them with `MONA_DENT_DB_URL`, `MONA_DENT_DB_USERNAME`, and `MONA_DENT_DB_PASSWORD` as needed.

Run the application from this directory:

```bash
./mvnw spring-boot:run
```

The API listens on port `8080` by default (`MONA_DENT_PORT` changes the port). Flyway applies schema migrations during startup. If the database has no users, startup seeds `admin@default.com` with the temporary password `yourAdmin!`; change it at first sign-in.

Patient files are stored in `~/.mona-dent/files` by default. Set `MONA_DENT_FILES_DIRECTORY` to use a different location. For production, set a private `MONA_DENT_JWT_SECRET` and configure the initial IP allowlist with `SECURITY_IP_ALLOWLIST_INITIAL_IP` and, optionally, `SECURITY_IP_ALLOWLIST_INITIAL_NAME`.

## Build

```bash
./mvnw package
```

For combined application installers, see [`packaging/README.md`](packaging/README.md). The repository-level [README](../README.md) covers the frontend and full application setup.
