export const queryKeys = {
  patients: {
    all: ["patients"] as const,
    list: (searchTerm?: string) => ["patients", "list", searchTerm] as const,
    detail: (id: string) => ["patients", "detail", id] as const,
  },
  advocates: {
    all: ["advocates"] as const,
    list: () => ["advocates", "list"] as const,
    detail: (id: string) => ["advocates", "detail", id] as const,
  },
  appointments: {
    all: ["appointments"] as const,
    list: () => ["appointments", "list"] as const,
    byAdvocate: ({
      advocateId,
      sortBy,
      sortDir,
    }: {
      advocateId: string;
      sortBy: string;
      sortDir: string;
    }) => ["appointments", "list", advocateId, sortBy, sortDir],
    detail: (id: string) => ["appointments", "detail", id] as const,
  },
};
