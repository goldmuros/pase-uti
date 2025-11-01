export interface Cultivos {
  id: string;
  fecha_solicitud: string;
  fecha_recibido: string | null;
  nombre: string;
  resultado: string;
  created_at: string;
  paciente_id: string;
  estado: string;
  activo: boolean;
}
