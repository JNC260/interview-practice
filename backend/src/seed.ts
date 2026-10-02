import { DataSource } from 'typeorm';
import { Patient } from './patients/patient.entity';
import { Advocate, AdvocateSpecialty } from './advocates/advocate.entity';
import { Appointment, AppointmentStatus } from './appointments/appointment.entity';

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
