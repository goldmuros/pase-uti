import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";
import type { Rol } from "../types/Rol";

// Query keys
export const rolesKeys = {
  all: ["roles"] as const,
  lists: () => [...rolesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...rolesKeys.lists(), filters] as const,
  details: () => [...rolesKeys.all, "detail"] as const,
  detail: (id: string) => [...rolesKeys.details(), id] as const,
};

// Get all roles
export const useRoles = () => {
  return useQuery({
    queryKey: rolesKeys.lists(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Rol[];
    },
  });
};

// Get role by ID
export const useRole = (id: string) => {
  return useQuery({
    queryKey: rolesKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Rol;
    },
    enabled: !!id,
  });
};

// Create role
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRole: Omit<Rol, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("roles")
        .insert(newRole)
        .select()
        .single();

      if (error) throw error;
      return data as Rol;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });
};

// Update role
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Rol> & { id: string }) => {
      const { data, error } = await supabase
        .from("roles")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Rol;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(data.id) });
    },
  });
};

// Delete role
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("roles").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
    },
  });
};
