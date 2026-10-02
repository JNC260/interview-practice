import { useAdvocates } from "../lib/hooks";

export const AdvocateTablePage = () => {
  const advocates = useAdvocates();

  return (
    <>
      <h2>Advocates ({advocates.data?.length ?? "…"})</h2>
      {advocates.error && <p>{advocates.error.message}</p>}
      <ul>
        {advocates.data?.map((a) => (
          <li key={a.id}>
            {a.fullName} ({a.specialty}
            {a.isActive ? "" : ", inactive"})
          </li>
        ))}
      </ul>
    </>
  );
};
