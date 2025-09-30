import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";
import type { Pase } from "../types/Pase";

// Query keys
export const pasesKeys = {
  all: ["pases"] as const,
  lists: () => [...pasesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...pasesKeys.lists(), filters] as const,
  details: () => [...pasesKeys.all, "detail"] as const,
  detail: (id: string) => [...pasesKeys.details(), id] as const,
};

// Get all pases
export const usePases = () => {
  return useQuery({
    queryKey: pasesKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pases")
        .select("*")
        .order("fecha_creacion", { ascending: false });

      if (error) throw error;
      return data as Pase[];
    },
  });
};

// Get pase by ID
export const usePase = (id: string) => {
  return useQuery({
    queryKey: pasesKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pases")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Pase;
    },
    enabled: !!id,
  });
};

// Create pase
export const useCreatePase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newPase: Omit<Pase, "id" | "fecha_creacion" | "fecha_modificacion">
    ) => {
      const { data, error } = await supabase
        .from("pases")
        .insert(newPase)
        .select()
        .single();

      if (error) throw error;
      return data as Pase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pasesKeys.lists() });
    },
  });
};

// Update pase
export const useUpdatePase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Pase> & { id: string }) => {
      const { data, error } = await supabase
        .from("pases")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Pase;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: pasesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pasesKeys.detail(data.id) });
    },
  });
};

// Delete pase
export const useDeletePase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pases").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pasesKeys.lists() });
    },
  });
};
