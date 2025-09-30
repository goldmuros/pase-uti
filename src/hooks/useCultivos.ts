import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";
import type { Cultivos } from "../types/Cultivos";

// Query keys
export const cultivosKeys = {
  all: ["cultivos"] as const,
  lists: () => [...cultivosKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...cultivosKeys.lists(), filters] as const,
  details: () => [...cultivosKeys.all, "detail"] as const,
  detail: (id: string) => [...cultivosKeys.details(), id] as const,
};

// Get all cultivos
export const useCultivos = () => {
  return useQuery({
    queryKey: cultivosKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cultivos")
        .select("*")
        .order("fecha_solicitud", { ascending: false });

      if (error) throw error;
      return data as Cultivos[];
    },
  });
};

// Get cultivo by ID
export const useCultivo = (id: string) => {
  return useQuery({
    queryKey: cultivosKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cultivos")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Cultivos;
    },
    enabled: !!id,
  });
};

// Create cultivo
export const useCreateCultivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCultivo: Omit<Cultivos, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("cultivos")
        .insert(newCultivo)
        .select()
        .single();

      if (error) throw error;
      return data as Cultivos;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cultivosKeys.lists() });
    },
  });
};

// Update cultivo
export const useUpdateCultivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Cultivos> & { id: string }) => {
      const { data, error } = await supabase
        .from("cultivos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Cultivos;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: cultivosKeys.lists() });
      queryClient.invalidateQueries({ queryKey: cultivosKeys.detail(data.id) });
    },
  });
};

// Delete cultivo
export const useDeleteCultivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cultivos").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cultivosKeys.lists() });
    },
  });
};
