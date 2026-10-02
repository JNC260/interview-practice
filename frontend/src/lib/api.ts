const API_BASE = "http://localhost:3000";

// Shapes mirror the backend entities as serialized to JSON (dates arrive as
// ISO strings).

export type AdvocateSpecialty =
  | "chronic_care"
  | "oncology"
  | "general_navigation"
  | "insurance";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Patient {
  id: string;
  fullName: string;
  email: string;
  conditions: string | null;
  createdAt: string;
}

export interface Advocate {
  id: string;
  fullName: string;
  specialty: AdvocateSpecialty;
  isActive: boolean;
  createdAt: string;
}

// GET /appointments and GET /appointments/:id include both relations; POST
// returns the bare row, so those are typed separately.
export interface Appointment {
  id: string;
  patientId: string;
  advocateId: string;
  scheduledAt: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
}

export interface AppointmentWithRelations extends Appointment {
  patient: Patient;
  advocate: Advocate;
}

export interface CreatePatientInput {
  fullName: string;
  email: string;
  conditions?: string;
}

export interface CreateAdvocateInput {
  fullName: string;
  specialty?: AdvocateSpecialty;
  isActive?: boolean;
}

export interface CreateAppointmentInput {
  patientId: string;
  advocateId: string;
  scheduledAt: string;
  status?: AppointmentStatus;
  notes?: string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!response.ok) {
    // Nest errors look like { message: string | string[], statusCode }.
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? response.statusText);
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export const api = {
  listPatients: (searchTerm?: string) =>
    request<Patient[]>(
      searchTerm ? `/patients?searchTerm=${searchTerm}` : "/patients",
    ),
  getPatient: (id: string) => request<Patient>(`/patients/${id}`),
  createPatient: (input: CreatePatientInput) =>
    post<Patient>("/patients", input),

  listAdvocates: () => request<Advocate[]>("/advocates"),
  getAdvocate: (id: string) => request<Advocate>(`/advocates/${id}`),
  createAdvocate: (input: CreateAdvocateInput) =>
    post<Advocate>("/advocates", input),

  listAppointments: () => request<AppointmentWithRelations[]>("/appointments"),
  getAppointment: (id: string) =>
    request<AppointmentWithRelations>(`/appointments/${id}`),
  createAppointment: (input: CreateAppointmentInput) =>
    post<Appointment>("/appointments", input),
};
