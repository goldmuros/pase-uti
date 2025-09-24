import {
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
import { mockCamas } from "../mock/camas";
import { mockCultivos } from "../mock/cultivos";
import { mockPacientes } from "../mock/pacientes";
import { mockPases } from "../mock/pases";
import type { Cultivos } from "../types/Cultivos";

const NuevoCultivo = (): ReactNode => {
  const navigate = useNavigate();
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Find the corresponding pase for the selected paciente
    const pase = mockPases.find(p => p.paciente_id === formData.paciente_id);
    if (!pase) {
      alert("No se encontró un pase activo para este paciente.");
      return;
    }

    // Create new cultivo
    const newCultivo: Cultivos = {
      ...formData,
      pase_id: pase.id,
      fecha_recibido: formData.fecha_recibido || null,
      id: `cult_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    // Add to mock data (in real app, this would be an API call)
    mockCultivos.push(newCultivo);

    // Navigate back to list
    navigate("/cultivos");
  };

  const handleCancel = () => {
    navigate("/cultivos");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Cultivo
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth required>
            <InputLabel>Paciente</InputLabel>
            <Select
              value={formData.paciente_id}
              onChange={() => handleChange("paciente_id")}
              label="Paciente"
            >
              {mockPacientes
                .filter(p => p.activo)
                .map(paciente => {
                  const cama = paciente.cama_id
                    ? mockCamas.find(c => c.id === paciente.cama_id)
                    : null;
                  return (
                    <MenuItem key={paciente.id} value={paciente.id}>
                      {paciente.nombre} {paciente.apellido}
                      {cama ? ` - Cama ${cama.numero} (${cama.sala})` : ""}
                    </MenuItem>
                  );
                })}
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
          <Button type="submit" variant="contained" color="primary">
            Crear Cultivo
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
