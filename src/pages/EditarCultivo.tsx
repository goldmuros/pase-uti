import { useCultivo, useUpdateCultivo } from "@/hooks/useCultivos";
import { usePacientes } from "@/hooks/usePacientes";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditarCultivo = (): ReactNode => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const updateCultivo = useUpdateCultivo();
  const { data: cultivo, isLoading, error } = useCultivo(id);
  const { data: pacientes } = usePacientes();

  const [formData, setFormData] = useState<{
    paciente_id: string;
    fecha_solicitud: string;
    fecha_recibido: string;
    nombre: string;
    resultado: string;
  }>({
    paciente_id: "",
    fecha_solicitud: "",
    fecha_recibido: "",
    nombre: "",
    resultado: "",
  });

  const formatDateTimeLocal = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (cultivo) {
      setFormData({
        paciente_id: (cultivo as any).paciente_id || "",
        fecha_solicitud: formatDateTimeLocal(cultivo.fecha_solicitud),
        fecha_recibido: formatDateTimeLocal(cultivo.fecha_recibido),
        nombre: cultivo.nombre,
        resultado: cultivo.resultado,
      });
    }
  }, [cultivo]);

  const handleChange =
    (field: keyof typeof formData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await updateCultivo.mutateAsync({
        id,
        ...formData,
        fecha_recibido: formData.fecha_recibido || null,
      });

      navigate("/cultivos");
    } catch (error) {
      console.error("Error updating cultivo:", error);
    }
  };

  const handleCancel = () => {
    navigate("/cultivos");
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" height={50} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={60} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={150} sx={{ mb: 3 }} />
      </Container>
    );
  }

  if (error || !cultivo) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Cultivo no encontrado"}</Alert>
        <Button onClick={handleCancel} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Editar Cultivo
      </Typography>

      {updateCultivo.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al actualizar el cultivo: {updateCultivo.error?.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth required>
            <InputLabel>Paciente</InputLabel>
            <Select
              value={formData.paciente_id}
              onChange={event =>
                setFormData(prev => ({
                  ...prev,
                  paciente_id: event.target.value,
                }))
              }
              label="Paciente"
              disabled
            >
              {pacientes
                ?.filter(p => p.activo)
                .map(paciente => (
                  <MenuItem key={paciente.id} value={paciente.id}>
                    {paciente.nombre} {paciente.apellido} - Cama {paciente.cama}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Nombre del Cultivo"
            value={formData.nombre}
            onChange={handleChange("nombre")}
            required
            disabled
            placeholder="Ej: Hemocultivos, Urocultivo, Cultivo de esputo"
          />
        </Box>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <TextField
              fullWidth
              label="Fecha de Solicitud"
              type="datetime-local"
              value={formData.fecha_solicitud}
              onChange={handleChange("fecha_solicitud")}
              required
              disabled
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 250 }}>
            <TextField
              fullWidth
              label="Fecha de Recibido"
              type="datetime-local"
              value={formData.fecha_recibido}
              onChange={handleChange("fecha_recibido")}
              InputLabelProps={{
                shrink: true,
              }}
              helperText="Opcional - dejar vacío si aún no se ha recibido"
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Resultado"
            value={formData.resultado}
            onChange={handleChange("resultado")}
            multiline
            rows={4}
            placeholder="Describa el resultado del cultivo..."
          />
        </Box>

        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={updateCultivo.isPending}
          >
            {updateCultivo.isPending ? "Actualizando..." : "Guardar Cambios"}
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default EditarCultivo;
