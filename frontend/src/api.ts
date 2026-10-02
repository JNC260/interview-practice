import type {
  Advocate,
  Appointment,
  CreateAppointmentInput,
  Patient,
} from './types';

const API_BASE = 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Request to ${path} failed (${response.status}): ${body}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getPatients: () => request<Patient[]>('/patients'),
  getAdvocates: () => request<Advocate[]>('/advocates'),
  getAppointments: () => request<Appointment[]>('/appointments'),
  createAppointment: (input: CreateAppointmentInput) =>
    request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
};
