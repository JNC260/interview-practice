import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { queryKeys } from "./queryKeys";

export function usePatients(searchTerm?: string) {
  return useQuery({
    queryKey: queryKeys.patients.list(searchTerm),
    queryFn: () => api.listPatients(searchTerm),
  });
}

export function useAdvocates() {
  return useQuery({
    queryKey: queryKeys.advocates.list(),
    queryFn: api.listAdvocates,
  });
}

export function useAppointments() {
  return useQuery({
    queryKey: queryKeys.appointments.list(),
    queryFn: api.listAppointments,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createAppointment,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.list(),
      }),
  });
}
