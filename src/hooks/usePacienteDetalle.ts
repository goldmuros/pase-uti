import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
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
export const usePacienteDetalle = (id: string) => {
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
        // Get paciente
        const { data: paciente, error: pacienteError } = await supabase
          .from("pacientes")
          .select("*")
          .eq("id", id)
          .single();

        if (pacienteError || !paciente) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Paciente no encontrado",
          }));
          return;
        }

        // Get pases for this paciente
        const { data: pasesPaciente, error: pasesError } = await supabase
          .from("pases")
          .select("*")
          .eq("paciente_id", id)
          .order("fecha_creacion", { ascending: false });

        if (pasesError) throw pasesError;

        // Get cultivos for these pases
        const paseIds = pasesPaciente?.map(p => p.id) || [];
        let cultivosPaciente: Cultivos[] = [];

        if (paseIds.length > 0) {
          const { data: cultivos, error: cultivosError } = await supabase
            .from("cultivos")
            .select("*")
            .eq("paciente_id", paciente.id)
            .order("fecha_recibido", { ascending: false, nullsFirst: false });

          if (cultivosError) throw cultivosError;
          cultivosPaciente = cultivos || [];
        }

        setState({
          paciente,
          pases: pasesPaciente || [],
          cultivos: cultivosPaciente,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: `Error al cargar los datos del paciente: ${error instanceof Error ? error.message : String(error)}`,
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
        // Get all pacientes ordered by fecha_ingreso desc
        const { data: pacientes, error } = await supabase
          .from("pacientes")
          .select("*")
          .order("fecha_ingreso", { ascending: false });

        if (error) throw error;

        setState({
          pacientes: pacientes || [],
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: `Error al cargar los pacientes: ${error instanceof Error ? error.message : String(error)}`,
        }));
      }
    };

    fetchData();
  }, []);

  return state;
};
