export interface Patient {
  id: string;
  fullName: string;
  email: string;
  conditions: string | null;
  createdAt: string;
}

export type AdvocateSpecialty =
  | 'chronic_care'
  | 'oncology'
  | 'general_navigation'
  | 'insurance';

export interface Advocate {
  id: string;
  fullName: string;
  specialty: AdvocateSpecialty;
  isActive: boolean;
  createdAt: string;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  advocateId: string;
  scheduledAt: string;
  status: AppointmentStatus;
  notes: string | null;
  patient: Patient;
  advocate: Advocate;
  createdAt: string;
}

export interface CreateAppointmentInput {
  patientId: string;
  advocateId: string;
  scheduledAt: string;
  notes?: string;
}
