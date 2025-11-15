import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";
import type { Paciente } from "../types/Paciente";

// Query keys
export const pacientesKeys = {
  all: ["pacientes"] as const,
  lists: () => [...pacientesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...pacientesKeys.lists(), filters] as const,
  details: () => [...pacientesKeys.all, "detail"] as const,
  detail: (id: string) => [...pacientesKeys.details(), id] as const,
};

const tabla = supabase.from("pacientes");

const getPacientesQuery = async (todosPacientes: boolean) => {
  let query = tabla.select(`
    *,
    cama:camas!pacientes_cama_id_fkey (
      id,
      cama,
      disponible
    )
  `);

  if (!todosPacientes) {
    query = query.eq("activo", true);
  }

  const { data, error } = await query.order("fecha_ingreso", {
    ascending: false,
  });

  if (error) throw error;
  return data as Paciente[];
};

// Get all pacientes
export const usePacientes = ({
  todosPacientes,
}: {
  todosPacientes: boolean;
}) => {
  return useQuery({
    queryKey: pacientesKeys.list({ todosPacientes }),
    queryFn: () => getPacientesQuery(todosPacientes),
  });
};

// Get paciente by ID con información de cama
export const usePaciente = (id: string) => {
  return useQuery({
    queryKey: pacientesKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await tabla
        .select(
          `
          *,
          cama:camas!pacientes_cama_id_fkey (
            id,
            cama,
            disponible,
            fecha_asignacion,
            fecha_liberacion
          )
        `
        )
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Paciente;
    },
    enabled: !!id,
  });
};

// Dar de alta a un paciente (liberar cama)
export const useDarDeAltaPaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Obtener el paciente para saber qué cama liberar
      const { data: paciente } = await tabla
        .select("cama_id")
        .eq("id", id)
        .single();

      // Actualizar paciente
      const { data, error } = await tabla
        .update({
          activo: false,
          fecha_alta: new Date().toISOString(),
          cama_id: null,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Liberar la cama si tenía una asignada
      if (paciente?.cama_id) {
        await supabase
          .from("camas")
          .update({
            disponible: true,
            fecha_liberacion: new Date().toISOString(),
          })
          .eq("id", paciente.cama_id);
      }

      return data as Paciente;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: pacientesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: pacientesKeys.detail(data.id),
      });
      queryClient.invalidateQueries({ queryKey: ["camas"] });
    },
  });
};
