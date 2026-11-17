# MonaDent frontend

This folder contains the Angular web app for MonaDent. It provides the clinic dashboard, appointment calendar, patient records and dental charts, file management, medical record PDFs, and screens for account and clinic administration.

The interface is built with Angular 21 and TypeScript. It uses Tailwind CSS for styling and FullCalendar for the appointment calendar. API calls are made through shared services in `src/app/core/services`.

## Run locally

Start the MonaDent backend on `http://localhost:8080`, then run from this directory:

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200). The development server proxies API requests from `/api` to the backend, as configured in `proxy.conf.json`.

## Build

```bash
npm run build
```

The production files are written to `dist/`. For the full application and backend setup, see the repository [README](../README.md).
