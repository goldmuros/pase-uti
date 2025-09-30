import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";
import type { Medico } from "../types/Medico";

// Query keys
export const medicosKeys = {
  all: ["medicos"] as const,
  lists: () => [...medicosKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...medicosKeys.lists(), filters] as const,
  details: () => [...medicosKeys.all, "detail"] as const,
  detail: (id: string) => [...medicosKeys.details(), id] as const,
};

// Get all medicos
export const useMedicos = () => {
  return useQuery({
    queryKey: medicosKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medicos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Medico[];
    },
  });
};

// Get medico by ID
export const useMedico = (id: string) => {
  return useQuery({
    queryKey: medicosKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medicos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Medico;
    },
    enabled: !!id,
  });
};

// Create medico
export const useCreateMedico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newMedico: Omit<Medico, "id" | "created_at" | "updated_at">
    ) => {
      const { data, error } = await supabase
        .from("medicos")
        .insert(newMedico)
        .select()
        .single();

      if (error) throw error;
      return data as Medico;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicosKeys.lists() });
    },
  });
};

// Update medico
export const useUpdateMedico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Medico> & { id: string }) => {
      const { data, error } = await supabase
        .from("medicos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Medico;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: medicosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: medicosKeys.detail(data.id) });
    },
  });
};

// Delete medico
export const useDeleteMedico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("medicos").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicosKeys.lists() });
    },
  });
};
