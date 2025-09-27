export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  cama: string | null;
  motivo_ingreso: string;
  activo: boolean;
  fecha_ingreso: string;
  fecha_alta?: string | null;
  created_at: string;
  updated_at: string;
}
