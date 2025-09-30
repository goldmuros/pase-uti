import type { Medico } from "../types/Medico";
import { useMedico, useMedicos } from "./useMedicos";

// Tipos para el estado del componente de detalle de medico
export interface DetalleMedicoState {
  medico: Medico | null;
  isLoading: boolean;
  error: string | null;
}

// Tipos para el estado del componente de lista de medicos
export interface ListaMedicosState {
  medicos: Medico[];
  isLoading: boolean;
  error: string | null;
}

// Hook personalizado para obtener datos del medico
export const useMedicoData = (id: string) => {
  const { data: medico, isLoading, error } = useMedico(id);

  return {
    medico: medico || null,
    isLoading,
    error: error?.message || null,
  };
};

// Hook personalizado para obtener datos de todos los medicos
export const useMedicosData = () => {
  const { data: medicos, isLoading, error } = useMedicos();

  return {
    medicos: medicos || [],
    isLoading,
    error: error?.message || null,
  };
};
