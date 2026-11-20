# MonaDent

**A full-stack clinic management application for dental practices.** MonaDent brings appointments, patient records, dental charts, and clinic administration together in one workspace.

## Overview

MonaDent is designed to help clinic teams manage day-to-day work from a single application. Staff can organize appointments, keep patient histories and visit notes, and review dental charts and related files. Role-aware administration supports multiple clinic branches, while the interface is available in English, Romanian, and Russian.

## Features

- Appointment scheduling with a calendar view
- Patient profiles, visit histories, and dental charts
- Patient file uploads and medical record PDF generation
- JSON patient data import and export
- Encrypted scheduled database and patient-file backups to the PC and an optional removable drive
- Branch, user, and IP allowlist administration
- English, Romanian, and Russian interface translations

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | Angular 21, TypeScript, Tailwind CSS, FullCalendar |
| Backend | Java 17+, Spring Boot |
| Database | PostgreSQL |

## Architecture

The repository contains a separate Angular frontend and Spring Boot backend. The frontend calls the backend through `/api`; during local development, the Angular dev server proxies those requests to `http://localhost:8080`.

```text
mona-dent-frontend/   Angular web application
mona-dent-backend/    Spring Boot API, database migrations, and packaging
```

## Run locally

You’ll need Node.js/npm, Java 17 or newer, and PostgreSQL. Start a PostgreSQL instance, then configure the backend connection with `MONA_DENT_DB_URL`, `MONA_DENT_DB_USERNAME`, and `MONA_DENT_DB_PASSWORD` as needed. See the [backend README](mona-dent-backend/README.md) for database and account setup details.

Start the backend in one terminal:

```bash
cd mona-dent-backend
./mvnw spring-boot:run
```

Start the frontend in another terminal:

```bash
cd mona-dent-frontend
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Build

```bash
# Frontend
cd mona-dent-frontend && npm run build

# Backend
cd mona-dent-backend && ./mvnw package
```

## Project notes

This project handles sensitive patient information. Use synthetic data when exploring or demonstrating the application, and review the deployment and security configuration before using it with real patient records.

---

Made by [Mona](https://github.com/Monecika) · [Frontend details](mona-dent-frontend/README.md) · [Backend details](mona-dent-backend/README.md)
