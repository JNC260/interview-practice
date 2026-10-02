import { DataSource } from 'typeorm';
import { Patient } from './patients/patient.entity';
import { Advocate, AdvocateSpecialty } from './advocates/advocate.entity';
import { Appointment, AppointmentStatus } from './appointments/appointment.entity';

const FIRST_NAMES = [
  'Aisha', 'Ben', 'Carmen', 'Dmitri', 'Elena', 'Farah', 'Gabriel', 'Hana',
  'Isaac', 'Julia', 'Kwame', 'Lucia', 'Marcus', 'Nadia', 'Omar', 'Paige',
  'Quinn', 'Rosa', 'Sanjay', 'Tamara', 'Umar', 'Valerie', 'Wei', 'Yusuf', 'Zoe',
];

const LAST_NAMES = [
  'Alvarez', 'Brooks', 'Castillo', 'Diallo', 'Evans', 'Fischer', 'Garcia',
  'Hughes', 'Ibrahim', 'Johnson', 'Kim', 'Lopez', 'Murphy', 'Nguyen',
  'Osei', 'Petrov', 'Ramirez', 'Singh', 'Tanaka', 'Walker', 'Yamamoto',
];

const CONDITIONS = [
  'Type 2 diabetes', 'Hypertension', 'Chronic pain', 'Asthma',
  'Recent cancer diagnosis', 'Breast cancer', 'COPD', 'Heart failure',
  'Rheumatoid arthritis', 'Multiple sclerosis', 'Chronic kidney disease',
  'Depression', 'Anxiety', 'Long COVID', 'Crohn\'s disease', 'Migraine',
];

// Deterministic so the seeded data is identical on every run. Name pairs are
// unique for count < FIRST_NAMES.length * LAST_NAMES.length (gcd(26, 21) = 1).
function generatePatients(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last =
      LAST_NAMES[(i + Math.floor(i / FIRST_NAMES.length)) % LAST_NAMES.length];

    // Mix of 0, 1, and 2 conditions; ~1 in 5 patients has none recorded.
    const numConditions = i % 5 === 0 ? 0 : (i % 2) + 1;
    const conditions = Array.from(
      { length: numConditions },
      (_, j) => CONDITIONS[(i * 3 + j * 7) % CONDITIONS.length],
    ).join(', ');

    return {
      fullName: `${first} ${last}`,
      email: `${first}.${last}`.toLowerCase() + '@example.com',
      conditions: conditions || null,
    };
  });
}

async function seed() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'solace-practice.sqlite',
    entities: [Patient, Advocate, Appointment],
    synchronize: true,
  });

  await dataSource.initialize();

  const patientRepo = dataSource.getRepository(Patient);
  const advocateRepo = dataSource.getRepository(Advocate);
  const appointmentRepo = dataSource.getRepository(Appointment);

  await appointmentRepo.clear();
  await patientRepo.clear();
  await advocateRepo.clear();

  const patients = await patientRepo.save([
    { fullName: 'Maria Chen', email: 'maria.chen@example.com', conditions: 'Type 2 diabetes' },
    { fullName: 'James Okafor', email: 'james.okafor@example.com', conditions: 'Recent cancer diagnosis' },
    { fullName: 'Priya Patel', email: 'priya.patel@example.com', conditions: 'Chronic pain' },
    ...generatePatients(97),
  ]);

  const advocates = await advocateRepo.save([
    { fullName: 'Dana Whitfield', specialty: AdvocateSpecialty.ONCOLOGY },
    { fullName: 'Rob Ellison', specialty: AdvocateSpecialty.CHRONIC_CARE },
    { fullName: 'Sam Iyer', specialty: AdvocateSpecialty.INSURANCE },
  ]);

  await appointmentRepo.save([
    {
      patientId: patients[1].id,
      advocateId: advocates[0].id,
      scheduledAt: new Date('2026-08-27T15:00:00Z'),
      status: AppointmentStatus.SCHEDULED,
      notes: 'Initial intake call re: treatment options',
    },
    {
      patientId: patients[0].id,
      advocateId: advocates[1].id,
      scheduledAt: new Date('2026-08-28T18:30:00Z'),
      status: AppointmentStatus.SCHEDULED,
    },
  ]);

  console.log('Seeded solace-practice.sqlite with sample patients, advocates, and appointments.');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
