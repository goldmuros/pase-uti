import type { Paciente } from "../types/Paciente";

export const pacientes: Paciente[] = [
  {
    id: "1",
    nombre: "María Elena",
    apellido: "González Pérez",
    cama: "A-101",
    activo: true,
    fechaIngreso: "2024-08-20",
  },
  {
    id: "2",
    nombre: "Carlos Alberto",
    apellido: "Rodríguez Silva",
    cama: "A-110",
    activo: true,
    fechaIngreso: "2024-08-19",
  },
  {
    id: "3",
    nombre: "Ana Sofía",
    apellido: "Martínez López",
    cama: "A-112",
    activo: false,
    fechaIngreso: "2024-08-15",
  },
];
