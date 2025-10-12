import { useCultivos } from "@/hooks/useCultivos";
import { useMedicos } from "@/hooks/useMedicos";
import { usePacientes } from "@/hooks/usePacientes";
import { useCreatePase } from "@/hooks/usePases";
import type { Pase } from "@/types/Pase";
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

const NuevoPase = (): ReactNode => {
  const navigate = useNavigate();
  const createPase = useCreatePase();
  const { data: pacientes } = usePacientes();
  const { data: medicos } = useMedicos();
  const { data: cultivos } = useCultivos();
  const [formData, setFormData] = useState<Omit<Pase, "id" | "fecha_creacion">>(
    {
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
    }
  );

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

    const cleanedData = {
      ...formData,
      cultivos_id: formData.cultivos_id?.trim() || null,
    };

    try {
      await createPase.mutateAsync({
        ...cleanedData,
      });

      // Navigate back to list on success
      navigate("/pases");
    } catch (error) {
      console.error("Error creating pase:", error);
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate("/pases");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Pase Médico
      </Typography>

      {createPase.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al crear el pase: {createPase.error?.message}
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
              {pacientes?.map(paciente => (
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
              onChange={event =>
                setFormData(prev => ({
                  ...prev,
                  medico_id: event.target.value,
                }))
              }
              label="Médico"
            >
              {medicos?.map(medico => (
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
              onChange={event =>
                setFormData(prev => ({
                  ...prev,
                  cultivos_id: event.target.value,
                }))
              }
              label="Cultivos"
            >
              <MenuItem value="">
                <em>Ninguno</em>
              </MenuItem>
              {cultivos?.map(cultivo => (
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createPase.isPending}
          >
            {createPase.isPending ? "Creando..." : "Crear Pase"}
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
