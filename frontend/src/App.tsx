import { useEffect, useState } from 'react';
import { api } from './api';
import type { Advocate, Appointment, Patient } from './types';
import './App.css';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [patientId, setPatientId] = useState('');
  const [advocateId, setAdvocateId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadAll() {
    setLoading(true);
    setError(null);
    try {
      const [patientsRes, advocatesRes, appointmentsRes] = await Promise.all([
        api.getPatients(),
        api.getAdvocates(),
        api.getAppointments(),
      ]);
      setPatients(patientsRes);
      setAdvocates(advocatesRes);
      setAppointments(appointmentsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleCreateAppointment(event: React.FormEvent) {
    event.preventDefault();
    if (!patientId || !advocateId || !scheduledAt) return;

    setSubmitting(true);
    setError(null);
    try {
      await api.createAppointment({
        patientId,
        advocateId,
        scheduledAt: new Date(scheduledAt).toISOString(),
      });
      setPatientId('');
      setAdvocateId('');
      setScheduledAt('');
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create appointment');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="status">Loading...</p>;

  return (
    <div className="app">
      <h1>Solace Practice — Advocate Scheduling</h1>
      {error && <p className="error">{error}</p>}

      <section>
        <h2>Schedule an appointment</h2>
        <form onSubmit={handleCreateAppointment} className="appointment-form">
          <label>
            Patient
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.fullName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Advocate
            <select
              value={advocateId}
              onChange={(e) => setAdvocateId(e.target.value)}
              required
            >
              <option value="">Select an advocate</option>
              {advocates.map((advocate) => (
                <option key={advocate.id} value={advocate.id}>
                  {advocate.fullName} ({advocate.specialty})
                </option>
              ))}
            </select>
          </label>

          <label>
            Date &amp; time
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Scheduling...' : 'Schedule appointment'}
          </button>
        </form>
      </section>

      <section>
        <h2>Upcoming appointments</h2>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Advocate</th>
              <th>When</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patient.fullName}</td>
                <td>{appointment.advocate.fullName}</td>
                <td>{new Date(appointment.scheduledAt).toLocaleString()}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
