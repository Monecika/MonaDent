# Mona Dent API

The API base path is `/api`. Send JSON bodies with `Content-Type: application/json`.
All endpoints require a bearer access token except `POST /api/auth/login`.

```http
Authorization: Bearer <accessToken>
```

The backend currently issues access tokens only; there is no refresh-token endpoint.

## Authentication

| Method | Path | Purpose | Success |
|---|---|---|---|
| `POST` | `/api/auth/login` | Sign in | `200` with access token and user details |
| `PUT` | `/api/auth/me/password` | Change current user's password | `204` |

Login body:

```json
{
  "email": "doctor@example.com",
  "password": "example-password"
}
```

Login response:

```json
{
  "accessToken": "<jwt>",
  "userId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "email": "doctor@example.com",
  "role": "DOCTOR"
}
```

Password update body:

```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password-at-least-8-characters"
}
```

## Users

| Method | Path | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/users/doctors?branchId={branchId}` | List active doctors (`doctorId`, `name`, `surname`) for a branch selector | Admin or user assigned to branch |
| `GET` | `/api/users/me` | Get own profile | Any authenticated user |
| `GET` | `/api/users` | List users | Admin; managers see users in their branches |
| `POST` | `/api/users` | Create a user | Admin or manager within their assigned branches |
| `PUT` | `/api/users/{userId}` | Update a user | Admin or manager within the same branch |
| `PUT` | `/api/users/me` | Update own profile | Any authenticated user |

Create user body:

```json
{
  "name": "Alex",
  "surname": "Dentist",
  "email": "alex@example.com",
  "phone": "+1-555-0100",
  "dateOfBirth": "1990-05-12",
  "calendarColor": "#336699",
  "role": "DOCTOR",
  "password": "example-password"
}
```

`branchIds` is optional and may be an empty array to create a user without branch assignments.
For `PUT /users/{userId}`, omitting `branchIds` keeps existing assignments; an empty array clears them.

Allowed roles: `ADMIN`, `DOCTOR`, `RECEPTIONIST`, `ASSISTANT`, `MANAGER`.
User status values are `ACTIVE` and `INACTIVE`. The profile response includes
`preferredLanguage` (`ro`, `ru`, or `en`); it defaults to Romanian (`ro`). To change it,
send `{"preferredLanguage":"ru"}` to `PUT /users/me`. For that endpoint, profile fields
such as name, surname, email, phone, date of birth, and calendar color can also change.
Role, status, and branch assignments are rejected.

Send `Accept-Language: ro`, `Accept-Language: ru`, or `Accept-Language: en` with API
requests to receive localized error responses. Error responses include the backend's
specific message and error type; known errors are localized to the requested language.

## IP address allowlist

| Method | Path | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/ip-addresses` | List registered IPv4 addresses and their names | Admin |
| `POST` | `/api/ip-addresses` | Register a named IPv4 address | Admin |
| `PUT` | `/api/ip-addresses/{id}` | Rename a registered address | Admin |
| `DELETE` | `/api/ip-addresses/{id}` | Remove an address (the final address cannot be removed) | Admin |

Create body:

```json
{
  "name": "Chișinău office",
  "address": "203.0.113.10"
}
```

Every API request, including login, is checked against the allowlist. If the database
contains no entries, API access is denied. Provision the first address through
`SECURITY_IP_ALLOWLIST_INITIAL_IP` and optionally `SECURITY_IP_ALLOWLIST_INITIAL_NAME`
when starting the backend; the initial address is inserted only when the table is empty.
The address is read directly from the TCP connection, so a reverse proxy must be
configured to provide a trusted client address before deploying behind one.

## Organization

Each app installation stores one organization's details for medical records.
Its `organizationId` is generated as a UUID when the settings record is created;
the official `idno` is supplied by the organization.

| Method | Path | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/organization` | Read organization name and IDNO | Any authenticated user |
| `PUT` | `/api/organization` | Save organization name and IDNO | Admin |

Update body:

```json
{
  "name": "Example Dental Clinic Ltd.",
  "idno": "1234567890123"
}
```

## Branches

| Method | Path | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/branches` | List all branches | Admin |
| `POST` | `/api/branches` | Create a branch | Admin |
| `PUT` | `/api/branches/{branchId}` | Update a branch name and/or address | Admin |
| `DELETE` | `/api/branches/{branchId}` | Delete an unused branch | Admin |
| `GET` | `/api/branches/assigned` | List current user's branches | Any authenticated user |

Create branch body:

```json
{
  "name": "Downtown Clinic",
  "address": "10 Main Street"
}
```

Branch updates may include `name`, `address`, or both. A branch cannot be
deleted while it has appointments or visits; on successful deletion, its user
assignments are removed.

## Patients

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/patients` | List patients |
| `GET` | `/api/patients/{patientId}` | Get a patient's profile |
| `POST` | `/api/patients` | Create a patient |
| `PUT` | `/api/patients/{patientId}` | Update a patient |

Any authenticated user can use these endpoints. Patients are not assigned to a branch.
There is no patient delete endpoint.

Create patient body:

```json
{
  "name": "Sam",
  "surname": "Patient",
  "dateOfBirth": "1985-09-20",
  "gender": "MALE",
  "homeAddress": "10 Example Street",
  "allergies": "",
  "diseases": "",
  "profession": "",
  "phone": "+1-555-0101"
}
```

Name, surname, date of birth, gender (`MALE` or `FEMALE`), home address, and
phone are required. Allergies and diseases may be empty; profession is optional.
Each patient receives a sequential `patientNumber`, starting at 1, for use on
the printed medical record. Existing patients retain their assigned number.

Patient profile response:

```json
{
  "patientId": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  "patientNumber": 1,
  "name": "Sam",
  "surname": "Patient",
  "dateOfBirth": "1985-09-20",
  "gender": "MALE",
  "homeAddress": "10 Example Street",
  "allergies": "",
  "diseases": "",
  "profession": "",
  "phone": "+1-555-0101",
  "createdAt": "2026-11-07T18:11:28+01:00"
}
```

Inserting a patient initializes an age-appropriate dental chart in the same
database transaction, whether the insert comes from the API or directly from
SQL: primary dentition for ages 0–5, a mixed template for ages 6–9, permanent
dentition without wisdom teeth for ages 10–17, and a full permanent layout
including wisdom teeth from age 18 onward. Each chart position has at most one
current tooth; for the mixed template, permanent positions 1, 2, and 6 take
precedence over the corresponding primary positions. These are approximate
template bands, not a claim that the patient has or has erupted those teeth.
Seeded teeth start as `findings: ["NOT_ASSESSED"]`; every chart entry is
present by default, and absence is recorded as a clinical finding. Mobility is
recorded separately as grade 1, 2, or 3. `updatedBy` is null until a user
updates the record. Correcting the birthdate rebuilds the age-based chart only
when no tooth has been edited; once there are tooth changes, the chart is
preserved. The chart does not otherwise change as the patient ages.

`GET /api/patients/{patientId}/teeth` returns the chart. Add a record with
`POST /api/patients/{patientId}/teeth`:

```json
{
  "toothNumber": 16,
  "toothType": "PERMANENT"
}
```

Tooth numbers use FDI notation; primary numbers are 51–55, 61–65, 71–75, and
81–85, and permanent numbers are 11–18, 21–28, 31–38, and 41–48. A current
tooth can be added to an empty position or replace the other dentition type in
that position. Replacements archive the previous tooth record and start with
the new tooth's submitted/default clinical details. A patient cannot have two
current teeth in the same position. `GET` returns only current teeth. The
`findings` array combines independent findings on one tooth: `CARIES`,
`PULPITIS`, `PERIODONTITIS`, `PERIODONTAL_DISEASE`, `ROOT_PROBLEM`, `FILLING`,
`CROWN`, `IMPLANT`, and `MISSING`, alongside `HEALTHY` and `NOT_ASSESSED`.
Missing and extracted teeth use the single `MISSING` finding. `MISSING` is
mutually exclusive with other findings. `HEALTHY` cannot be combined with an active disease, and
`NOT_ASSESSED` must stand alone. Implants cannot be combined with natural-tooth
diseases, fillings, or crowns. Active conditions can coexist with restorations
and with each other.
`mobilityGrade` is separate and accepts `1`, `2`, or `3`.

`PUT /api/patients/{patientId}/teeth/{toothId}` updates the findings, mobility
grade, and notes. The database trigger is the single source of chart
initialization, so the API does not separately seed teeth. Existing databases
are upgraded by Flyway migrations V6–V8; new databases should be created
from the updated `sql.sql`.

## Appointments

| Method | Path | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/appointments?branchId={branchId}` | List all appointments for a branch | Admin or user assigned to branch |
| `GET` | `/api/appointments?branchId={branchId}&date=2026-11-07` | List a branch's appointments for a date | Admin or user assigned to branch |
| `GET` | `/api/appointments/patient/{patientId}` | List all appointments for a patient | Any authenticated user |
| `GET` | `/api/appointments/patient/{patientId}/next` | Get the nearest future appointment | Any authenticated user |
| `POST` | `/api/appointments` | Create an appointment | Admin or user assigned to its branch |
| `PUT` | `/api/appointments/{appointmentId}` | Update an appointment | Admin or user assigned to its branch |
| `DELETE` | `/api/appointments/{appointmentId}` | Delete an appointment | Admin or user assigned to its branch |

Create appointment body:

```json
{
  "branchId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  "patientId": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  "userId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "appointmentDate": "2026-12-01T10:30:00+01:00",
  "durationMinutes": 30,
  "description": "Dental check-up",
  "notes": "Patient requested morning appointment"
}
```

Update bodies may include `patientId`, `userId`, `appointmentDate`, `durationMinutes`,
`description`, `notes`, and `status`. The branch cannot be changed. Statuses are
`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, and `NO_SHOW`.
`CANCELLED` and `NO_SHOW` are set manually; scheduled appointments transition to
`IN_PROGRESS` at their start time and to `COMPLETED` after their duration.

Appointment responses include a `patient` object with `patientId`, `name`, `surname`,
`dateOfBirth`, `phone`, and `createdAt`, alongside `appointmentId`, `branchName`,
an `employee` object with `employeeId`, `role` (`"Dr."`), `name`, and `surname`,
`appointmentDate`, `durationMinutes`, `description`, `notes`, and `status`.

The next-appointment endpoint returns `200` with an appointment, `204 No Content` if
there is no future appointment, or `404` if the patient does not exist.

## Visits

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/visits/patient/{patientId}` | List a patient's visits |
| `POST` | `/api/visits` | Create a visit |

Any authenticated user can use these endpoints. There are no visit update or delete
endpoints.

Create visit body:

```json
{
  "branchId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  "patientId": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  "doctorId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "appointmentId": null,
  "visitDate": "2026-12-01T10:30:00+01:00",
  "description": "Dental check-up",
  "notes": "Initial examination"
}
```

`durationMinutes` is optional and defaults to `5` in the database. Visit responses include
the branch name and doctor title/name/surname.

## Patient teeth

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/patients/{patientId}/teeth` | List current teeth for a patient |
| `GET` | `/api/patients/{patientId}/teeth/history` | List tooth changes, newest first |
| `POST` | `/api/patients/{patientId}/teeth` | Add or replace a tooth in a position |
| `PUT` | `/api/patients/{patientId}/teeth/{toothId}` | Update an individual tooth |

Any authenticated user can use these endpoints. Adding a tooth accepts `toothNumber`,
`toothType`, and optionally `findings`, `mobilityGrade`, and `notes`. Replacing the
other dentition type in the same position archives the previous record. Tooth updates
accept `findings`, `mobilityGrade`, and/or `notes`; the updater ID is taken from the
authenticated user. Successful additions, replacements, and actual clinical changes
are recorded and returned by the history endpoint.

```json
{
  "findings": ["CARIES", "ROOT_PROBLEM", "CROWN"],
  "mobilityGrade": 2,
  "notes": "Review at next visit"
}
```

Tooth types: `PRIMARY`, `PERMANENT`. Findings: `NOT_ASSESSED`, `HEALTHY`, `CARIES`,
`PULPITIS`, `PERIODONTITIS`, `PERIODONTAL_DISEASE`, `ROOT_PROBLEM`, `FILLING`,
`CROWN`, `IMPLANT`, and `MISSING`. Mobility grades are `1`, `2`, and `3`.
Only the current tooth at each position is returned by `GET`.

## Errors

Errors use this shape:

```json
{
  "status": 400,
  "errorType": "Validation Failed",
  "message": "name: must not be blank"
}
```

Common response codes are `400` for invalid input, `401` for missing/invalid
authentication, `403` for insufficient permissions, and `404` when a requested resource
does not exist. See the OpenAPI contracts in `src/main/resources/contracts` for field
constraints and the canonical schemas.
