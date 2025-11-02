import { useGetCultivosPorPaciente } from "@/hooks/useCultivos";
import { useMedicos } from "@/hooks/useMedicos";
import { usePacientes } from "@/hooks/usePacientes";
import { useCreatePase, usePase } from "@/hooks/usePases";
import type { PaseType } from "@/types/Pase";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CULTIVOS } from "./Cultivo";

const DEFAULT_PASE: Omit<PaseType, "id" | "fecha_creacion"> = {
  antecedentes: "",
  gcs_rass: "",
  atb: "",
  vc_cook: "",
  actualmente: "",
  pendientes: "",
  paciente_id: "",
  principal: "",
  medico_id: "",
  cultivos_id: [],
  fecha_modificacion: "",
};

const Pase = (): ReactNode => {
  const { id: paseId = "" } = useParams();
  const navigate = useNavigate();
  const createPase = useCreatePase();

  const [formPase, setFormPase] =
    useState<Omit<PaseType, "id" | "fecha_creacion">>(DEFAULT_PASE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Primero obtener el pase
  const { data: pase } = usePase(paseId);
  const { data: pacientes } = usePacientes({ todosPacientes: false });
  const { data: medicos } = useMedicos();

  // Obtener cultivos basado en el paciente_id del formulario
  const { data: cultivos } = useGetCultivosPorPaciente(formPase.paciente_id);

  const hayPase = Boolean(paseId);

  // Reset cuando cambia el paseId
  useEffect(() => {
    setIsInitialized(false);
    setFormPase(DEFAULT_PASE);
  }, [paseId]);

  useEffect(() => {
    if (!pase || !paseId || isInitialized) return;

    const newCultivosId = Array.isArray(pase.cultivos_id)
      ? pase.cultivos_id
      : pase.cultivos_id
        ? [pase.cultivos_id]
        : [];

    const newFormData = {
      antecedentes: pase.antecedentes || "",
      gcs_rass: pase.gcs_rass || "",
      atb: pase.atb || "",
      vc_cook: pase.vc_cook || "",
      actualmente: pase.actualmente || "",
      pendientes: pase.pendientes || "",
      paciente_id: pase.paciente_id || "",
      principal: pase.principal || "",
      medico_id: pase.medico_id || "",
      cultivos_id: newCultivosId,
      fecha_modificacion: pase.fecha_modificacion || "",
    };

    setFormPase(newFormData);
    setIsInitialized(true);
  }, [pase, paseId, isInitialized]);

  const handleChange =
    (field: keyof typeof formPase) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormPase(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handlePacienteChange = (pacienteId: string) => {
    setFormPase(prev => ({
      ...prev,
      paciente_id: pacienteId,
      // Limpiar cultivos seleccionados al cambiar de paciente
      cultivos_id: [],
    }));
  };

  const handleCultivosChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setFormPase(prev => ({
      ...prev,
      cultivos_id: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanedData = {
      ...formPase,
      cultivos_id:
        formPase.cultivos_id && formPase.cultivos_id.length > 0
          ? formPase.cultivos_id
          : null,
    };

    try {
      await createPase.mutateAsync({
        ...cleanedData,
      });

      navigate("/pases");
    } catch (error) {
      console.error("Error creating pase:", error);
    }
  };

  const handleCancel = () => {
    navigate("/pases");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {hayPase ? "Ver" : "Crear Nuevo"} Pase Médico
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth required>
            <InputLabel>Paciente</InputLabel>
            <Select
              label="Paciente"
              disabled={hayPase}
              value={formPase.paciente_id}
              onChange={event => handlePacienteChange(event.target.value)}
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
              label="Médico"
              disabled={hayPase}
              value={formPase.medico_id}
              onChange={event =>
                setFormPase(prev => ({
                  ...prev,
                  medico_id: event.target.value,
                }))
              }
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
          <FormControl fullWidth disabled={!formPase.paciente_id}>
            <InputLabel>Cultivos</InputLabel>
            {hayPase ? (
              <Box
                sx={{
                  minHeight: 56,
                  borderRadius: 1,
                  padding: "16.5px 14px",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Box sx={{ mt: 2 }}>
                  {cultivos &&
                  formPase.cultivos_id &&
                  formPase.cultivos_id.length > 0 ? (
                    cultivos.map(cultivo => (
                      <Chip
                        key={cultivo.id}
                        label={
                          CULTIVOS.filter(
                            filterCultivo => filterCultivo.id === cultivo.nombre
                          )[0].nombre
                        }
                        size="small"
                        color="info"
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No hay cultivos seleccionados
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <Select
                multiple
                label="Cultivos"
                value={formPase.cultivos_id || []}
                onChange={handleCultivosChange}
                renderValue={selected => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map(value => {
                      const cultivo = cultivos?.find(c => c.id === value);
                      return (
                        <Chip
                          key={value}
                          label={cultivo?.nombre || value}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {cultivos && cultivos.length > 0 ? (
                  cultivos.map(cultivo => (
                    <MenuItem key={cultivo.id} value={cultivo.id}>
                      {cultivo.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    <em>No hay cultivos para este paciente</em>
                  </MenuItem>
                )}
              </Select>
            )}
          </FormControl>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Diagnóstico Principal"
            required
            value={formPase.principal}
            onChange={handleChange("principal")}
            disabled={hayPase}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Antecedentes"
            multiline
            rows={2}
            value={formPase.antecedentes}
            onChange={handleChange("antecedentes")}
            disabled={hayPase}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Estado Actual"
              multiline
              rows={2}
              value={formPase.actualmente}
              onChange={handleChange("actualmente")}
              disabled={hayPase}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Pendientes"
              multiline
              rows={2}
              value={formPase.pendientes}
              onChange={handleChange("pendientes")}
              disabled={hayPase}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextField
              fullWidth
              label="GCS/RASS"
              multiline
              rows={2}
              value={formPase.gcs_rass}
              onChange={handleChange("gcs_rass")}
              disabled={hayPase}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextField
              fullWidth
              label="ATB"
              multiline
              rows={2}
              value={formPase.atb}
              onChange={handleChange("atb")}
              disabled={hayPase}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextField
              fullWidth
              label="VC Cook"
              multiline
              value={formPase.vc_cook}
              onChange={handleChange("vc_cook")}
              disabled={hayPase}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          {!hayPase && (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={createPase.isPending}
            >
              Crear Pase
            </Button>
          )}
          <Button variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Pase;
