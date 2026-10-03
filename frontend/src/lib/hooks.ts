import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { api } from "./api";
import { queryKeys } from "./queryKeys";

export function usePatients(searchTerm?: string) {
  return useQuery({
    queryKey: queryKeys.patients.list(searchTerm),
    queryFn: () => api.listPatients(searchTerm),
    placeholderData: keepPreviousData,
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

export function useAppointmentsByAdvocate({
  advocateId,
  sortBy = "scheduledAt",
  sortDir = "DESC",
  enabled = false,
}: {
  advocateId: string;
  sortBy?: string;
  sortDir?: string;
  enabled: boolean;
}) {
  return useQuery({
    enabled,
    queryKey: queryKeys.appointments.byAdvocate({
      advocateId,
      sortBy,
      sortDir,
    }),
    queryFn: () =>
      api.listAppointmentsByAdvocate({ advocateId, sortBy, sortDir }),
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
