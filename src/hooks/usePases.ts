import type { PasePaciente } from "@/components/Pases/CardPase";
import { formatDateTimeLocal } from "@/utils/fechas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";
import type { PaseType } from "../types/Pase";

// Query keys
export const pasesKeys = {
  all: ["pases"] as const,
  lists: () => [...pasesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...pasesKeys.lists(), filters] as const,
  details: () => [...pasesKeys.all, "detail"] as const,
  detail: (id: string) => [...pasesKeys.details(), id] as const,
};

// Helper function to clean pase data before sending to database
const cleanPaseData = (data: any) => {
  const cleaned = { ...data };

  // Handle cultivos_id as array
  if (Array.isArray(cleaned.cultivos_id)) {
    // If empty array, set to null
    if (cleaned.cultivos_id.length === 0) {
      cleaned.cultivos_id = null;
    }
    // If has values, keep as array
  } else if (!cleaned.cultivos_id || cleaned.cultivos_id === "") {
    cleaned.cultivos_id = null;
  } else if (typeof cleaned.cultivos_id === "string") {
    // Convert single string to array
    cleaned.cultivos_id = [cleaned.cultivos_id];
  }

  // UUID fields - convert empty strings to null
  const uuidFields = ["paciente_id", "medico_id"];
  uuidFields.forEach(field => {
    if (!cleaned[field] || cleaned[field] === "") {
      cleaned[field] = null;
    }
  });

  // Remove timestamp fields that are handled automatically by the database
  delete cleaned.fecha_creacion;
  delete cleaned.fecha_modificacion;
  delete cleaned.id;

  // Remove cultivos if it exists (it's computed data, not a DB field)
  delete cleaned.cultivos;

  return {
    ...cleaned,
    fecha_creacion: formatDateTimeLocal(new Date().toISOString()),
  };
};

// Get all pases
export const usePases = (fechaFiltro: Date) => {
  return useQuery({
    queryKey: pasesKeys.list({ fecha: fechaFiltro }),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pases")
        .select(
          `
          *,
          pacientes!inner (
            id,
            nombre,
            apellido,
            cama_id,
            cama:camas!pacientes_cama_id_fkey (
              id,
              cama
            )
          )
        `
        )
        .eq("fecha_creacion", formatDateTimeLocal(fechaFiltro.toString()))
        .order("pacientes(cama_id)", { ascending: true });

      if (error) throw error;

      // Transformar los datos para aplanar la estructura de cama
      const transformedData = data.map((pase: any) => ({
        ...pase,
        pacientes: {
          id: pase.pacientes.id,
          nombre: pase.pacientes.nombre,
          apellido: pase.pacientes.apellido,
          cama: pase.pacientes.cama?.cama || null, // Número de cama o null
        },
      }));

      return transformedData as PasePaciente[];
    },
  });
};

// Get pase by ID with related cultivos
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

      // Transform data to include cultivos as an array
      const paseWithCultivos = {
        ...data,
        cultivos: data.cultivos
          ? Array.isArray(data.cultivos)
            ? data.cultivos
            : [data.cultivos]
          : [],
      };

      return paseWithCultivos as PaseType & {
        cultivos: Array<{ id: string; nombre: string }>;
      };
    },
    enabled: Boolean(id),
  });
};

// Create pase
export const useCreatePase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newPase: Omit<PaseType, "id" | "fecha_creacion" | "fecha_modificacion">
    ) => {
      // Clean the data before inserting
      const cleanedPase = cleanPaseData(newPase);

      const { data, error } = await supabase
        .from("pases")
        .insert(cleanedPase)
        .select()
        .single();

      if (error) throw error;
      return data as PaseType;
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
    mutationFn: async ({
      id,
      ...updates
    }: Partial<PaseType> & { id: string }) => {
      // Clean the data before updating
      const cleanedUpdates = cleanPaseData(updates);

      const { data, error } = await supabase
        .from("pases")
        .update(cleanedUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as PaseType;
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
