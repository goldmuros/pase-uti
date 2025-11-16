import { useEffect, useState } from "react";
import { supabase } from "../config/supabase";
import type { Cultivos } from "../types/Cultivos";
import type { Paciente } from "../types/Paciente";
import type { PaseType } from "../types/Pase";
import type { Cama } from "./useCamas";

// Tipos para el estado del componente de detalle de paciente
export interface DetallePacienteState {
  cama: Cama | null;
  paciente: Paciente | null;
  pases: PaseType | null;
  cultivos: Cultivos | null;
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
    cama: null,
    paciente: null,
    pases: null,
    cultivos: null,
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

        // Get paciente
        const { data: cama, error: camaError } = await supabase
          .from("camas")
          .select("*")
          .eq("id", paciente.cama_id)
          .single();

        if (camaError || !cama) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Cama no encontrado",
          }));
          return;
        }

        const { data: pasesPaciente, error: pasesError } = await supabase
          .from("pases")
          .select("*")
          .eq("paciente_id", id)
          .order("fecha_creacion", { ascending: false });

        if (pasesError) throw pasesError;

        const { data: cultivos, error: cultivosError } = await supabase
          .from("cultivos")
          .select("*")
          .eq("paciente_id", paciente.id)
          .eq("activo", true)
          .order("fecha_recibido", { ascending: false, nullsFirst: false });

        if (cultivosError) throw cultivosError;

        setState({
          cama,
          paciente,
          pases: pasesPaciente.length > 0 ? pasesPaciente[0] : null,
          cultivos: cultivos.length > 0 ? cultivos[0] : null,
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

export const updatePaciente = async (
  pacienteId: string,
  updates: Partial<Paciente>
): Promise<Paciente> => {
  const { data, error } = await supabase
    .from("pacientes")
    .update(updates)
    .eq("id", pacienteId)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar paciente: ${error.message}`);
  }

  return data as Paciente;
};
