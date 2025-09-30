import { useCreateCultivo } from "@/hooks/useCultivos";
import { usePacientes } from "@/hooks/usePacientes";
import { usePases } from "@/hooks/usePases";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const NuevoCultivo = (): ReactNode => {
  const navigate = useNavigate();
  const createCultivo = useCreateCultivo();
  const { data: pacientes } = usePacientes();
  const { data: pases } = usePases();
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

    // Find the corresponding pase for the selected paciente
    const pase = pases?.find(p => p.paciente_id === formData.paciente_id);
    if (!pase) {
      alert("No se encontró un pase activo para este paciente.");
      return;
    }

    try {
      await createCultivo.mutateAsync({
        ...formData,
        pase_id: pase.id,
        fecha_recibido: formData.fecha_recibido || null,
      });

      // Navigate back to list on success
      navigate("/cultivos");
    } catch (error) {
      console.error("Error creating cultivo:", error);
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate("/cultivos");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Cultivo
      </Typography>

      {createCultivo.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al crear el cultivo: {createCultivo.error?.message}
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
            disabled={createCultivo.isPending}
          >
            {createCultivo.isPending ? "Creando..." : "Crear Cultivo"}
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NuevoCultivo;
