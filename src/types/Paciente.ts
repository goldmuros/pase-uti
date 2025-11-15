export interface Paciente {
  id: string;
  activo: boolean;
  apellido: string;
  nombre: string;
  cama_id: string | null;
  motivo_alta: string | null;
  motivo_ingreso: string;
  fecha_ingreso: string;
  fecha_alta: string | null;
  created_at: string;
  updated_at: string;
}
