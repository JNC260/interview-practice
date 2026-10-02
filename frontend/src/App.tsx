import { useState } from "react";
import { AdvocateTablePage } from "./components/AdvocateTablePage";
import { PatientTablePage } from "./components/PatientTablePage";
import { CreateAppointmentPage } from "./components/CreateAppointmentPage";

function App() {
  const [page, setPage] = useState("home");
  const onClick = (pageId: "appointment" | "home" | "advocate" | "patient") => {
    setPage(pageId);
  };
  return (
    <main style={{ textAlign: "left", padding: "1rem" }}>
      <button
        type="button"
        onClick={() => onClick("appointment")}
        value="appointment"
      >
        Create Appointment
      </button>
      <button
        type="button"
        onClick={() => onClick("advocate")}
        value="advocate"
      >
        View Advocates
      </button>
      <button type="button" onClick={() => onClick("patient")} value="patient">
        View Patients
      </button>
      {page === "home" && <h1>Pick a page</h1>}
      {page === "appointment" && <CreateAppointmentPage />}
      {page === "advocate" && <AdvocateTablePage />}
      {page === "patient" && <PatientTablePage />}
    </main>
  );
}

export default App;
