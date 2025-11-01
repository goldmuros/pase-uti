export const mockCultivos: import("../types/Cultivos").Cultivos[] = [
  {
    id: "cult_1",
    fecha_solicitud: "2025-08-28T10:00:00Z",
    fecha_recibido: "2025-08-30T12:00:00Z",
    nombre: "Hemocultivos",
    resultado: "Negativo",
    created_at: "2025-08-28T10:00:00Z",
    paciente_id: "paciente_1",
    estado: "pendiente",
    activo: true,
  },
  {
    id: "cult_2",
    fecha_solicitud: "2025-08-25T09:00:00Z",
    fecha_recibido: "2025-08-27T11:00:00Z",
    nombre: "Cultivo peritoneal",
    resultado: "E. coli resistente",
    created_at: "2025-08-25T09:00:00Z",
    paciente_id: "paciente_2",
    estado: "positivo",
    activo: true,
  },
];
