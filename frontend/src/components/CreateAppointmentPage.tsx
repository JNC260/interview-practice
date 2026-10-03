import { useState, type FormEvent, useMemo } from "react";
import {
  useAdvocates,
  useAppointments,
  useAppointmentsByAdvocate,
  useBulkAppointmentCancel,
  useCreateAppointment,
  usePatients,
} from "../lib/hooks";
import { type AppointmentWithRelations } from "../lib/api";

type AppointmentListProps = {
  appointments: AppointmentWithRelations[];
  sortBy: string;
  sortDir: string;
  handleSort: (value: string) => void;
  error?: Error | null;
};
const AppointmentList = ({
  appointments,
  sortBy,
  sortDir,
  handleSort,
  error,
}: AppointmentListProps) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [failedUpdates, setFailedUpdates] = useState<
    { id: string; reason: string }[]
  >([]);

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev); // copy, don't mutate the old Set
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const bulkCancelAppointments = useBulkAppointmentCancel();

  function handleBulkAppointmentCancel() {
    const ids = Array.from(selectedIds.values());
    bulkCancelAppointments.mutate(
      { appointmentIds: ids },
      {
        onSuccess: (result) => {
          setFailedUpdates(result.fail);
          setSelectedIds(new Set());
        },
      },
    );
  }
  const failMessage = useMemo(() => {
    return `Update failed for the following appointments: ${failedUpdates.map((u) => `${u.id}: ${u.reason}`)}`;
  }, [failedUpdates.length]);
  return (
    <>
      <h2>Appointments ({appointments.length ?? "…"})</h2>
      <select
        value={[sortBy, sortDir]}
        onChange={(e) => handleSort(e.target.value)}
      >
        Sort options
        <option value={["scheduledAt", "ASC"]}>Date ascending</option>
        <option value={["scheduledAt", "DESC"]}>Date descending</option>
        <option value={["status", "ASC"]}>Status ascending</option>
        <option value={["status", "DESC"]}>Status descending</option>
      </select>
      {error && <p>{error.message}</p>}
      <button
        type="button"
        disabled={selectedIds.size === 0}
        onClick={() => handleBulkAppointmentCancel()}
      >
        Bulk cancel
      </button>
      {failedUpdates.length > 0 && <p>{failMessage}</p>}
      <ul>
        {appointments.map((a) => (
          <>
            <input
              type="checkbox"
              checked={selectedIds.has(a.id)}
              onChange={() => toggleSelected(a.id)}
            ></input>
            <li key={a.id}>
              {new Date(a.scheduledAt).toLocaleString()}: {a.patient.fullName}{" "}
              with {a.advocate.fullName} ({a.status})
            </li>
          </>
        ))}
      </ul>
    </>
  );
};

export const CreateAppointmentPage = () => {
  const patients = usePatients();
  const advocates = useAdvocates();
  const createAppointment = useCreateAppointment();

  const [patientId, setPatientId] = useState("");
  const [advocateId, setAdvocateId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [sortBy, setSortBy] = useState("scheduledAt");
  const [sortDir, setSortDir] = useState("DESC");

  const allAppointments = useAppointments();

  const appointmentsByAdvocate = useAppointmentsByAdvocate({
    advocateId,
    sortBy,
    sortDir,
    enabled: Boolean(advocateId),
  });

  const visibleAppointments = advocateId
    ? appointmentsByAdvocate
    : allAppointments;

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

  function handleSort(value: string) {
    const [by, dir] = value.split(",");
    setSortBy(by);
    setSortDir(dir);
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
      <AppointmentList
        appointments={visibleAppointments.data ?? []}
        sortBy={sortBy}
        sortDir={sortDir}
        handleSort={handleSort}
        error={visibleAppointments.error}
      />
    </>
  );
};
