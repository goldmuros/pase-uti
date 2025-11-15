import type { Paciente } from "@/types/Paciente";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";

// Tipos - Exactamente como están en la base de datos
export interface Cama {
  id: string;
  cama: number;
  disponible: boolean;
  fecha_asignacion: string | null;
  fecha_liberacion: string | null;
  created_at: string;
  updated_at: string;
}

export interface CamaConPaciente extends Cama {
  pacientes: Paciente;
}

// Query keys
export const camasKeys = {
  all: ["camas"] as const,
  lists: () => [...camasKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...camasKeys.lists(), filters] as const,
  details: () => [...camasKeys.all, "detail"] as const,
  detail: (id: string) => [...camasKeys.details(), id] as const,
  disponibles: () => [...camasKeys.all, "disponibles"] as const,
};

const tabla = supabase.from("camas");

// Get all camas
export const useCamas = () => {
  return useQuery({
    queryKey: camasKeys.lists(),
    queryFn: async () => {
      const { data, error } = await tabla
        .select("*")
        .order("cama", { ascending: true });

      if (error) throw error;
      return data as Cama[];
    },
  });
};

// Get camas disponibles (solo las que están libres)
export const useCamasDisponibles = () => {
  return useQuery({
    queryKey: camasKeys.disponibles(),
    queryFn: async () => {
      const { data, error } = await tabla
        .select("*")
        .eq("disponible", true)
        .order("cama", { ascending: true });

      if (error) throw error;
      return data as Cama[];
    },
  });
};

// Get camas con información del paciente
export const useCamasConPaciente = () => {
  return useQuery({
    queryKey: camasKeys.list({
      withPaciente: true,
    }),
    queryFn: async () => {
      const { data, error } = await tabla
        .select(
          `
          *,
          pacientes!pacientes_cama_id_fkey (
            id,
            nombre,
            apellido,
            motivo_ingreso,
            fecha_ingreso,
            fecha_alta,
            motivo_alta
          )
        `
        )
        .order("cama", { ascending: true });

      if (error) throw error;

      // Transformar el array de pacientes a un solo objeto
      return data.map((cama: any) => ({
        ...cama,
        pacientes: cama.pacientes?.[0] || null,
      })) as CamaConPaciente[];
    },
  });
};

// Get cama by ID
export const useCama = (id: string) => {
  return useQuery({
    queryKey: camasKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await tabla.select("*").eq("id", id).single();

      if (error) throw error;
      return data as Cama;
    },
    enabled: !!id,
  });
};

// Update cama
export const useUpdateCama = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Cama> & { id: string }) => {
      const { data, error } = await tabla
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Cama;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: camasKeys.lists() });
      queryClient.invalidateQueries({ queryKey: camasKeys.disponibles() });
      queryClient.invalidateQueries({ queryKey: camasKeys.detail(data.id) });
    },
  });
};

// Asignar paciente a cama
export const useAsignarCama = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      camaId,
      pacienteId,
    }: {
      camaId: string;
      pacienteId: string;
    }) => {
      const { data, error } = await tabla
        .update({
          disponible: false,
          fecha_asignacion: new Date().toISOString(),
        })
        .eq("id", camaId)
        .select()
        .single();

      if (error) throw error;
      return data as Cama;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: camasKeys.lists() });
      queryClient.invalidateQueries({ queryKey: camasKeys.disponibles() });
    },
  });
};

// Liberar cama
export const useLiberarCama = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (camaId: string) => {
      const { data, error } = await tabla
        .update({
          disponible: true,
          fecha_liberacion: new Date().toISOString(),
        })
        .eq("id", camaId)
        .select()
        .single();

      if (error) throw error;
      return data as Cama;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: camasKeys.lists() });
      queryClient.invalidateQueries({ queryKey: camasKeys.disponibles() });
    },
  });
};

// Get estadísticas de camas
export const useEstadisticasCamas = () => {
  return useQuery({
    queryKey: [...camasKeys.all, "estadisticas"],
    queryFn: async () => {
      const { data, error } = await tabla.select("disponible");

      if (error) throw error;

      const estadisticas = {
        total: data.length,
        disponibles: data.filter(c => c.disponible === true).length,
        ocupadas: data.filter(c => c.disponible === false).length,
      };

      return estadisticas;
    },
  });
};
