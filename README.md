# Solace Practice Repo

A small full-stack app (NestJS + TypeORM + React/TS) modeled loosely on
Solace Health's domain — patients, advocates, and appointments — for
practicing "read someone else's code and extend it" style interviews.

## Stack

- **Backend**: NestJS, TypeORM (`better-sqlite3` driver), class-validator
- **Frontend**: React + TypeScript (Vite)

## Running it

**Backend**
```bash
cd backend
npm install
npm run seed    # populates solace-practice.sqlite with sample data
npm run start:dev
```
Runs on http://localhost:3000

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173, talks to the backend at localhost:3000.

## Domain model

- `Patient` — has many `Appointment`s
- `Advocate` — has a `specialty` (chronic_care, oncology, general_navigation,
  insurance), has many `Appointment`s
- `Appointment` — belongs to one `Patient` and one `Advocate`, has a
  `scheduledAt` time and a `status`

Look at `patients/`, `advocates/`, and `appointments/` in `backend/src` —
they all follow the same module/controller/service/entity shape, which is
a good thing to point out out loud in an interview ("this follows the same
pattern as the other resource, so I'll mirror it").

## Things intentionally left simple (good practice exercises)

1. **No double-booking check.** `AppointmentsService.create` doesn't verify
   the advocate is free at that time. Try adding it — this is a great
   "walk through your reasoning out loud" exercise: what counts as a
   conflict? Do you query first or catch a constraint violation? What do
   you return to the client?
2. **No pagination** on the list endpoints.
3. **No update/cancel endpoint** for appointments — only create/read.
4. **`conditions` is a plain string** on `Patient` rather than a related
   entity/join table — a reasonable thing to question in a real interview
   ("would this be normalized in production?").
5. **No auth** — every endpoint is open.

## Suggested practice flow

1. Open the codebase cold, like you would in the CodeSignal IDE, and narrate
   how you'd explore it (start at `app.module.ts`, then trace one resource
   end to end).
2. Pick one of the "intentionally simple" items above and implement it,
   thinking out loud as if being watched.
3. Ask yourself the kind of curious questions an interviewer would want to
   hear: "should this be case-insensitive?", "what happens if two people
   book the same slot at the same instant?", "is `notes` free text — could
   that be a validation gap?"
