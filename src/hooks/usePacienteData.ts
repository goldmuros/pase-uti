import { useEffect, useState } from "react";
import { mockCultivos } from "../mock/cultivos";
import { mockPacientes } from "../mock/pacientes";
import { mockPases } from "../mock/pases";
import type { Cultivos } from "../types/Cultivos";
import type { Paciente } from "../types/Paciente";
import type { Pase } from "../types/Pase";

// Tipos para el estado del componente de detalle de paciente
export interface DetallePacienteState {
  paciente: Paciente | null;
  pases: Pase[];
  cultivos: Cultivos[];
  isLoading: boolean;
  error: string | null;
}

// Tipos para el estado del componente de lista de pacientes
export interface ListaPacientesState {
  pacientes: Paciente[];
  isLoading: boolean;
  error: string | null;
}

// Hook personalizado para obtener datos del paciente
export const usePacienteData = (id: string) => {
  const [state, setState] = useState<DetallePacienteState>({
    paciente: null,
    pases: [],
    cultivos: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300));

        const paciente = mockPacientes.find(p => p.id === id);

        if (!paciente) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Paciente no encontrado",
          }));
          return;
        }

        const pasesPaciente = mockPases
          .filter(pase => pase.paciente_id === id)
          .sort(
            (a, b) =>
              new Date(b.fecha_creacion).getTime() -
              new Date(a.fecha_creacion).getTime()
          );

        const cultivosPaciente = mockCultivos
          .filter(cultivo =>
            pasesPaciente.some(pase => pase.id === cultivo.pase_id)
          )
          .sort(
            (a, b) =>
              new Date(b.fecha_recibido || "").getTime() -
              new Date(a.fecha_recibido || "").getTime()
          );

        setState({
          paciente,
          pases: pasesPaciente,
          cultivos: cultivosPaciente,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error + "Error al cargar los datos del paciente",
        }));
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return state;
};

// Hook personalizado para obtener datos de todos los pacientes
export const usePacientesData = () => {
  const [state, setState] = useState<ListaPacientesState>({
    pacientes: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Ordenar pacientes por fecha de ingreso (más recientes primero)
        const pacientesOrdenados = mockPacientes.sort(
          (a, b) =>
            new Date(b.fecha_ingreso).getTime() -
            new Date(a.fecha_ingreso).getTime()
        );

        setState({
          pacientes: pacientesOrdenados,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error + "Error al cargar los pacientes",
        }));
      }
    };

    fetchData();
  }, []);

  return state;
};
