export const formatDateTimeLocal = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Función auxiliar para obtener solo la parte de fecha (YYYY-MM-DD) de un timestamp
export const getDateOnly = (dateString: string | null): string | null => {
  if (!dateString) return null;
  // Extraer solo YYYY-MM-DD
  return dateString.split("T")[0];
};
