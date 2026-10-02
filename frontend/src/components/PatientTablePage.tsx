import { useState } from "react";
import { usePatients } from "../lib/hooks";
import { useDebouncedCallback } from "use-debounce";

export const PatientTablePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const result = usePatients(searchTerm);
  const patients = result.data ?? [];
  const error = result.error;

  const debouncedSearch = useDebouncedCallback(
    // function
    (searchTerm: string) => {
      console.log("TERM", searchTerm);
      setSearchTerm(searchTerm);
    },
    // delay in ms
    300,
  );
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
            {p.fullName} ({p.email})
          </li>
        ))}
      </ul>
    </>
  );
};
