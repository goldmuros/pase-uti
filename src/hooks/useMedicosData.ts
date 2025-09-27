import { useEffect, useState } from "react";
import { mockMedicos } from "../mock/medicos";
import type { Medico } from "../types/Medico";

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
  const [state, setState] = useState<DetalleMedicoState>({
    medico: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300));

        const medico = mockMedicos.find(m => m.id === id);

        if (!medico) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Médico no encontrado",
          }));
          return;
        }

        setState({
          medico,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: `Error al cargar los datos del médico: ${error instanceof Error ? error.message : String(error)}`,
        }));
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return state;
};

// Hook personalizado para obtener datos de todos los medicos
export const useMedicosData = () => {
  const [state, setState] = useState<ListaMedicosState>({
    medicos: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Ordenar medicos por fecha de creación (más recientes primero)
        const medicosOrdenados = mockMedicos.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setState({
          medicos: medicosOrdenados,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: `Error al cargar los médicos: ${error instanceof Error ? error.message : String(error)}`,
        }));
      }
    };

    fetchData();
  }, []);

  return state;
};
