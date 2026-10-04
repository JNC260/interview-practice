import { useState } from "react";
import { usePatients } from "../lib/hooks";
import { useDebouncedCallback } from "use-debounce";
import { useDeletePatient } from "../lib/hooks";

export const PatientTablePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<
    string | null
  >(null);

  const result = usePatients(searchTerm);
  const patients = result.data ?? [];
  const error = result.error;

  const debouncedSearch = useDebouncedCallback(
    // function
    (searchTerm: string) => {
      setSearchTerm(encodeURIComponent(searchTerm));
    },
    // delay in ms
    300,
  );

  const deletePatient = useDeletePatient();

  const handleDelete = (id: string) => {
    setShowDeleteConfirmation(null);

    deletePatient.mutate(id, {
      onSuccess: (result: string) => {
        alert(result);
      },
      onError: (e) => alert(e.message),
    });
  };

  return (
    <>
      <h2>Patients ({patients.length ?? "…"})</h2>
      {error && <p>{error.message}</p>}
      <input
        onChange={(e) => debouncedSearch(e.target.value)}
        type="search"
      ></input>
      <ul>
        {patients?.map((p) => (
          <li key={p.id}>
            <p>
              {p.fullName} ({p.email})
            </p>
            {!showDeleteConfirmation && (
              <button onClick={() => setShowDeleteConfirmation(p.id)}>
                Delete
              </button>
            )}
            {showDeleteConfirmation === p.id && (
              <>
                <button onClick={() => handleDelete(p.id)}>Confirm</button>
                <button onClick={() => setShowDeleteConfirmation(null)}>
                  Cancel
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
