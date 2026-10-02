import { useState, type FormEvent } from "react";
import {
  useAdvocates,
  useAppointments,
  useCreateAppointment,
  usePatients,
} from "../lib/hooks";

export const CreateAppointmentPage = () => {
  const patients = usePatients();
  const advocates = useAdvocates();
  const appointments = useAppointments();
  const createAppointment = useCreateAppointment();

  const [patientId, setPatientId] = useState("");
  const [advocateId, setAdvocateId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    createAppointment.mutate(
      {
        patientId,
        advocateId,
        // datetime-local gives local time with no zone; send it as UTC.
        scheduledAt: new Date(scheduledAt).toISOString(),
      },
      { onSuccess: () => setScheduledAt("") },
    );
  }

  return (
    <>
      <h2>Create appointment</h2>
      <form onSubmit={handleSubmit}>
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          required
        >
          <option value="">Patient</option>
          {patients.data?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName}
            </option>
          ))}
        </select>{" "}
        <select
          value={advocateId}
          onChange={(e) => setAdvocateId(e.target.value)}
          required
        >
          <option value="">Advocate</option>
          {advocates.data?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.fullName}
            </option>
          ))}
        </select>{" "}
        <input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          required
        />{" "}
        <button type="submit" disabled={createAppointment.isPending}>
          {createAppointment.isPending ? "Creating..." : "Create"}
        </button>
      </form>
      {createAppointment.error && (
        <p style={{ color: "crimson" }}>{createAppointment.error.message}</p>
      )}

      <h2>Appointments ({appointments.data?.length ?? "…"})</h2>
      {appointments.error && <p>{appointments.error.message}</p>}
      <ul>
        {appointments.data?.map((a) => (
          <li key={a.id}>
            {new Date(a.scheduledAt).toLocaleString()}: {a.patient.fullName}{" "}
            with {a.advocate.fullName} ({a.status})
          </li>
        ))}
      </ul>
    </>
  );
};
