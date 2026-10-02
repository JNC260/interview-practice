import { useState } from 'react';
import SchedulePage from './SchedulePage';
import PatientTablePage from './PatientTablePage';
import './App.css';

type Page = 'schedule' | 'patients';

function App() {
  const [page, setPage] = useState<Page>('schedule');

  return (
    <div className="app">
      <h1>Solace Practice — Advocate Scheduling</h1>

      <nav className="nav">
        <button
          type="button"
          onClick={() => setPage('schedule')}
          aria-current={page === 'schedule' ? 'page' : undefined}
        >
          Schedule appointment
        </button>
        <button
          type="button"
          onClick={() => setPage('patients')}
          aria-current={page === 'patients' ? 'page' : undefined}
        >
          Patient table
        </button>
      </nav>

      {page === 'schedule' ? <SchedulePage /> : <PatientTablePage />}
    </div>
  );
}

export default App;
