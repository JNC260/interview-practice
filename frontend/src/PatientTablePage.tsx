import { useEffect, useState } from 'react';
import { api } from './api';
import type { Patient } from './types';

function PatientTablePage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getPatients()
      .then(setPatients)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Something went wrong'),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status">Loading...</p>;

  return (
    <>
      {error && <p className="error">{error}</p>}

      <section>
        <h2>Patients</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Conditions</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.fullName}</td>
                <td>{patient.email}</td>
                <td>{patient.conditions}</td>
                <td>{new Date(patient.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default PatientTablePage;
