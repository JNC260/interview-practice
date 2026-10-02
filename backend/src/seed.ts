import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Patient } from './patients/patient.entity.js';
import { Advocate, AdvocateSpecialty } from './advocates/advocate.entity.js';
import {
  Appointment,
  AppointmentStatus,
} from './appointments/appointment.entity.js';

const FIRST_NAMES = [
  'Maria',
  'James',
  'Priya',
  'Aisha',
  'Ben',
  'Carmen',
  'Dmitri',
  'Elena',
  'Farah',
  'Gabriel',
  'Hana',
  'Isaac',
  'Julia',
  'Kwame',
  'Lucia',
  'Marcus',
  'Nadia',
  'Omar',
  'Paige',
  'Rosa',
  'Sanjay',
  'Tamara',
  'Wei',
  'Yusuf',
  'Zoe',
];

const LAST_NAMES = [
  'Chen',
  'Okafor',
  'Patel',
  'Alvarez',
  'Brooks',
  'Castillo',
  'Diallo',
  'Evans',
  'Fischer',
  'Garcia',
  'Hughes',
  'Ibrahim',
  'Johnson',
  'Kim',
  'Lopez',
  'Murphy',
  'Nguyen',
  'Osei',
  'Petrov',
  'Ramirez',
  'Singh',
];

const CONDITIONS = [
  'Type 2 diabetes',
  'Hypertension',
  'Chronic pain',
  'Asthma',
  'Breast cancer',
  'COPD',
  'Heart failure',
  'Rheumatoid arthritis',
  'Multiple sclerosis',
  'Chronic kidney disease',
  'Depression',
  'Long COVID',
];

const ADVOCATE_NAMES = [
  'Dana Whitfield',
  'Rob Ellison',
  'Sam Iyer',
  'Grace Holloway',
  'Luis Moreno',
  'Keisha Grant',
  'Tom Becker',
  'Ana Sousa',
  'Peter Lindqvist',
  'Mei Lin',
  'Jordan Reyes',
  'Fatima Haddad',
  'Chris Novak',
  'Olivia Hart',
  'Ravi Menon',
  'Sofia Rossi',
  'Daniel Abara',
  'Emma Clarke',
  'Hiro Sato',
  'Leah Goldberg',
];

const SPECIALTIES = Object.values(AdvocateSpecialty);

const PATIENT_COUNT = 100;
const APPOINTMENT_COUNT = 50;
const DAY_MS = 24 * 60 * 60 * 1000;

// All generation is index-based (no randomness), so every run produces the
// same data.
function buildPatients(): Partial<Patient>[] {
  return Array.from({ length: PATIENT_COUNT }, (_, i) => {
    // Unique (first, last) pair for every i < 25 * 21, since gcd(26, 21) = 1.
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last =
      LAST_NAMES[(i + Math.floor(i / FIRST_NAMES.length)) % LAST_NAMES.length];

    // Every other patient has 1-2 conditions; the rest have none recorded.
    let conditions: string | null = null;
    if (i % 2 === 0) {
      // Index by i / 2 so odd positions in CONDITIONS get used too.
      const k = i / 2;
      const count = k % 3 === 0 ? 2 : 1;
      conditions = Array.from(
        { length: count },
        (_, j) => CONDITIONS[(k * 5 + j * 7) % CONDITIONS.length],
      ).join(', ');
    }

    return {
      fullName: `${first} ${last}`,
      email: `${first}.${last}@example.com`.toLowerCase(),
      conditions,
    };
  });
}

function buildAdvocates(): Partial<Advocate>[] {
  return ADVOCATE_NAMES.map((fullName, i) => ({
    fullName,
    specialty: SPECIALTIES[i % SPECIALTIES.length],
    isActive: i !== 7,
  }));
}

function buildAppointments(
  patients: Patient[],
  advocates: Advocate[],
): Partial<Appointment>[] {
  const activeAdvocates = advocates.filter((a) => a.isActive);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const now = Date.now();

  return Array.from({ length: APPOINTMENT_COUNT }, (_, i) => {
    // Days -14..+13 relative to today, between 9am and 4pm. At most two
    // appointments share a day, and those get different advocates, so the
    // (advocateId, scheduledAt) unique index is never hit.
    const dayOffset = Math.floor((i * 28) / APPOINTMENT_COUNT) - 14;
    const hour = 9 + ((i * 3) % 8);
    const scheduledAt = new Date(
      today.getTime() + dayOffset * DAY_MS + hour * 60 * 60 * 1000,
    );

    // Past appointments are mostly completed, future ones mostly scheduled,
    // with roughly 1 in 6 cancelled either way.
    let status: AppointmentStatus;
    if (i % 6 === 5) {
      status = AppointmentStatus.CANCELLED;
    } else if (scheduledAt.getTime() < now) {
      status = AppointmentStatus.COMPLETED;
    } else {
      status = AppointmentStatus.SCHEDULED;
    }

    return {
      // gcd(37, 100) = 1, so all 50 appointments get different patients.
      patientId: patients[(i * 37) % patients.length].id,
      advocateId: activeAdvocates[(i * 7) % activeAdvocates.length].id,
      scheduledAt,
      status,
      notes: i % 4 === 0 ? 'Initial intake call' : null,
    };
  });
}

async function seed() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'dev.sqlite',
    entities: [Patient, Advocate, Appointment],
    synchronize: true,
  });
  await dataSource.initialize();

  const patientRepo = dataSource.getRepository(Patient);
  const advocateRepo = dataSource.getRepository(Advocate);
  const appointmentRepo = dataSource.getRepository(Appointment);

  // Appointments first, since they reference the other two tables.
  await appointmentRepo.clear();
  await patientRepo.clear();
  await advocateRepo.clear();

  const patients = await patientRepo.save(buildPatients());
  const advocates = await advocateRepo.save(buildAdvocates());
  await appointmentRepo.save(buildAppointments(patients, advocates));

  console.log(
    `Seeded dev.sqlite: ${await patientRepo.count()} patients, ` +
      `${await advocateRepo.count()} advocates, ` +
      `${await appointmentRepo.count()} appointments.`,
  );
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
