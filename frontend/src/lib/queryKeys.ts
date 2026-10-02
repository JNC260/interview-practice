// Keys are hierarchical, so invalidating `all` also covers every list and
// detail query for that resource.
function resourceKeys<const R extends string>(resource: R) {
  return {
    all: [resource] as const,
    list: () => [resource, 'list'] as const,
    detail: (id: string) => [resource, 'detail', id] as const,
  }
}

export const queryKeys = {
  patients: resourceKeys('patients'),
  advocates: resourceKeys('advocates'),
  appointments: resourceKeys('appointments'),
}
