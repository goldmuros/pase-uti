export interface Cultivos {
  id: string;
  pase_id: string;
  fecha_solicitud: string;
  fecha_recibido: string | null;
  nombre: string;
  resultado: string;
  created_at: string;
}
