import { formatDateTimeLocal } from "@/utils/fechas";
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

const getCultivosQuery = (pacienteId?: string | null) => {
  let query = supabase
    .from("cultivos")
    .select(
      `
      *,
      pacientes!inner (
        id,
        nombre,
        apellido,
        cama,
        activo
      )
    `
    )
    .eq("activo", true); // Solo cultivos activos

  if (pacienteId) {
    query = query.eq("paciente_id", pacienteId);
  }

  return query.order("pacientes(cama)", { ascending: true });
};

export const useGetCultivosPorPaciente = (pacienteId?: string) => {
  return useQuery({
    queryKey: cultivosKeys.list({
      pacienteId,
    }),
    queryFn: async () => {
      const { data } = await supabase
        .from("cultivos")
        .select("*")
        .eq("activo", true)
        .eq("paciente_id", pacienteId);

      return data;
    },
    enabled: Boolean(pacienteId),
  });
};

// Get all cultivos
export const useCultivos = (
  fechaFiltro: Date | null,
  pacienteId?: string | null
) => {
  return useQuery({
    queryKey: cultivosKeys.list({
      pacienteId,
    }),
    queryFn: async () => {
      const { data, error } = await getCultivosQuery(pacienteId);

      if (error) throw error;

      // Filtrar por fecha en el cliente
      let filteredData = data as any[];

      if (fechaFiltro) {
        const fechaStr = formatDateTimeLocal(fechaFiltro.toISOString());

        filteredData = filteredData.filter(cultivo => {
          // Incluir si fecha_recibido coincide O si es null
          return (
            !cultivo.fecha_recibido ||
            formatDateTimeLocal(cultivo.fecha_recibido) === fechaStr
          );
        });
      }

      const sortedData = filteredData.sort((a, b) => {
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
        estado: data.estado,
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
      const { data, error } = await supabase
        .from("cultivos")
        .update({ activo: false })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cultivosKeys.all });
    },
  });
};
