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
const getPacientesQuery = (todosPacientes: boolean) => {
  let query = tabla.select("*");

  if (!todosPacientes) {
    query = query.eq("activo", !todosPacientes);
  }

  return query.order("fecha_ingreso", { ascending: false });
};

// Get all pacientes
export const usePacientes = ({
  todosPacientes,
}: {
  todosPacientes: boolean;
}) => {
  return useQuery({
    queryKey: pacientesKeys.lists(),
    queryFn: async () => {
      const { data, error } = await getPacientesQuery(todosPacientes);

      if (error) throw error;
      return data as Paciente[];
    },
  });
};

// Get paciente by ID
export const usePaciente = (id: string) => {
  return useQuery({
    queryKey: pacientesKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await tabla.select("*").eq("id", id).single();

      if (error) throw error;
      return data as Paciente;
    },
    enabled: !!id,
  });
};

// Create paciente
export const useCreatePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newPaciente: Omit<Paciente, "id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await tabla.insert(newPaciente).select().single();

      if (error) throw error;
      return data as Paciente;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pacientesKeys.lists() });
    },
  });
};

// Update paciente
export const useUpdatePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Paciente> & { id: string }) => {
      const { data, error } = await tabla
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Paciente;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: pacientesKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: pacientesKeys.detail(data.id),
      });
    },
  });
};

// Delete paciente
export const useDeletePaciente = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await tabla.delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pacientesKeys.lists() });
    },
  });
};
