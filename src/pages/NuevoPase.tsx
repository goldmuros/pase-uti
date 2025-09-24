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
import { mockCultivos } from "../mock/cultivos";
import { mockMedicos } from "../mock/medicos";
import { mockPacientes } from "../mock/pacientes";
import { mockPases } from "../mock/pases";
import type { PaseProps } from "../types/Pase";

const NuevoPase = (): ReactNode => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<
    Omit<PaseProps, "id" | "fecha_creacion">
  >({
    antecedentes: "",
    gcs_rass: "",
    atb: "",
    vc_cook: "",
    actualmente: "",
    pendientes: "",
    paciente_id: "",
    principal: "",
    medico_id: "",
    cultivos_id: "",
    fecha_modificacion: "",
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

    // Create new pase
    const newPase: PaseProps = {
      ...formData,
      id: Date.now().toString(),
      fecha_creacion: new Date().toISOString(),
      fecha_modificacion: new Date().toISOString(),
    };

    // Add to mock data (in real app, this would be an API call)
    mockPases.push(newPase);

    // Navigate back to list
    navigate("/pases");
  };

  const handleCancel = () => {
    navigate("/pases");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Pase Médico
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
              {mockPacientes.map(paciente => (
                <MenuItem key={paciente.id} value={paciente.id}>
                  {paciente.nombre} {paciente.apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth required>
            <InputLabel>Médico</InputLabel>
            <Select
              value={formData.medico_id}
              onChange={() => handleChange("medico_id")}
              label="Médico"
            >
              {mockMedicos.map(medico => (
                <MenuItem key={medico.id} value={medico.id}>
                  {medico.nombre} {medico.apellido}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Cultivos</InputLabel>
            <Select
              value={formData.cultivos_id}
              onChange={() => handleChange("cultivos_id")}
              label="Cultivos"
            >
              <MenuItem value="">
                <em>Ninguno</em>
              </MenuItem>
              {mockCultivos.map(cultivo => (
                <MenuItem key={cultivo.id} value={cultivo.id}>
                  {cultivo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Diagnóstico Principal"
            value={formData.principal}
            onChange={handleChange("principal")}
            required
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Antecedentes"
            value={formData.antecedentes}
            onChange={handleChange("antecedentes")}
            multiline
            rows={3}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Estado Actual"
              value={formData.actualmente}
              onChange={handleChange("actualmente")}
              multiline
              rows={3}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Pendientes"
              value={formData.pendientes}
              onChange={handleChange("pendientes")}
              multiline
              rows={3}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextField
              fullWidth
              label="GCS/RASS"
              value={formData.gcs_rass}
              onChange={handleChange("gcs_rass")}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextField
              fullWidth
              label="ATB"
              value={formData.atb}
              onChange={handleChange("atb")}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextField
              fullWidth
              label="VC Cook"
              value={formData.vc_cook}
              onChange={handleChange("vc_cook")}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Crear Pase
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NuevoPase;
