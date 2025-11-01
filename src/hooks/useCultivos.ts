import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabase";
import type { Cultivos } from "../types/Cultivos";

const formatDateTimeLocal = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// Query keys
export const cultivosKeys = {
  all: ["cultivos"] as const,
  lists: () => [...cultivosKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...cultivosKeys.lists(), filters] as const,
  details: () => [...cultivosKeys.all, "detail"] as const,
  detail: (id: string) => [...cultivosKeys.details(), id] as const,
};

const getCultivosQuery = (
  pacienteId: string | null,
  fechaFiltro: Date | null
) => {
  let query = supabase.from("cultivos").select(`
      *,
      pacientes!inner (
        id,
        nombre,
        apellido,
        cama,
        activo
      )
    `);

  if (pacienteId) {
    query = query.eq("paciente_id", pacienteId);
  }

  // Filtrar por fecha si se proporciona
  if (fechaFiltro) {
    const fechaInicio = new Date(fechaFiltro);
    fechaInicio.setHours(0, 0, 0, 0);

    const fechaFin = new Date(fechaFiltro);
    fechaFin.setHours(23, 59, 59, 999);

    query = query.eq("fecha_recibido", fechaInicio.toISOString());
  }

  return query.order("pacientes(cama)", { ascending: true });
};

// Get all cultivos
export const useCultivos = (
  pacienteId: string | null,
  fechaFiltro: Date | null = null
) => {
  return useQuery({
    queryKey: cultivosKeys.list({
      pacienteId,
      fechaFiltro: fechaFiltro?.toISOString(),
    }),
    queryFn: async () => {
      const { data, error } = await getCultivosQuery(pacienteId, fechaFiltro);

      if (error) throw error;

      const sortedData = (data as any[]).sort((a, b) => {
        const camaA = parseInt(a.pacientes?.cama || "0", 10);
        const camaB = parseInt(b.pacientes?.cama || "0", 10);

        if (camaA !== camaB) {
          return camaA - camaB;
        }

        // Si las camas son iguales, ordenar por fecha
        return (
          new Date(b.fecha_solicitud).getTime() -
          new Date(a.fecha_solicitud).getTime()
        );
      });

      return sortedData as Cultivos[];
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
      return {
        paciente_id: data.paciente_id || "",
        fecha_solicitud: formatDateTimeLocal(data.fecha_solicitud),
        fecha_recibido: formatDateTimeLocal(data.fecha_recibido),
        nombre: data.nombre,
        resultado: data.resultado,
      } as Cultivos;
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

// Delete cultivo (soft delete - marca como inactivo)
export const useDeleteCultivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("cultivos")
        .update({ activo: false })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cultivosKeys.lists() });
    },
  });
};
