import { useCamas } from "@/hooks/useCamas";
import { useCreatePaciente } from "@/hooks/usePacientes";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Paciente } from "../types/Paciente";

const NuevoPaciente = (): ReactNode => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const createPaciente = useCreatePaciente();
  const camaIdFromUrl = searchParams.get("camaId");

  const { data: camas = [] } = useCamas();

  const [formData, setFormData] = useState<
    Omit<Paciente, "id" | "created_at" | "updated_at">
  >({
    nombre: "",
    apellido: "",
    cama_id: camaIdFromUrl || null,
    motivo_alta: "",
    motivo_ingreso: "",
    activo: true,
    fecha_ingreso: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    fecha_alta: null,
  });

  const handleChange =
    (field: keyof typeof formData) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleCama = (camaId: string) => {
    setFormData(prev => ({
      ...prev,
      cama_id: camaId,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await createPaciente.mutateAsync({
        ...formData,
        fecha_ingreso: new Date(formData.fecha_ingreso).toISOString(),
      });

      // Navigate back to list on success
      navigate("/pacientes");
    } catch (error) {
      console.error("Error creating paciente:", error);
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate("/pacientes");
  };

  // Filtrar camas disponibles
  const camasDisponibles = camas.filter(cama => cama.disponible);

  return (
    <Container
      maxWidth="md"
      sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", sm: "2.125rem" } }}
      >
        Crear Nuevo Paciente
      </Typography>

      {createPaciente.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al crear el paciente: {createPaciente.error?.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: { xs: 2, sm: 3 },
            flexDirection: { xs: "column", sm: "row" },
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange("nombre")}
              required
              size="small"
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}>
            <TextField
              fullWidth
              label="Apellido"
              value={formData.apellido}
              onChange={handleChange("apellido")}
              required
              size="small"
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth required>
            <InputLabel>Cama</InputLabel>
            <Select
              label="Cama"
              value={formData.cama_id || ""}
              onChange={event => handleCama(event.target.value)}
            >
              {camasDisponibles.map(cama => (
                <MenuItem key={cama.id} value={cama.id}>
                  Cama {cama.cama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Motivo de Ingreso"
            value={formData.motivo_ingreso}
            onChange={handleChange("motivo_ingreso")}
            multiline
            rows={3}
            required
            size="small"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Fecha de Ingreso"
            type="date"
            value={formData.fecha_ingreso}
            onChange={handleChange("fecha_ingreso")}
            InputLabelProps={{
              shrink: true,
            }}
            required
            size="small"
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.activo}
                onChange={handleChange("activo")}
                size="small"
              />
            }
            label="Paciente Activo"
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
          />
        </Box>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={createPaciente.isPending}
            sx={{ order: { xs: 2, sm: 1 } }}
          >
            {createPaciente.isPending ? "Creando..." : "Crear Paciente"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            fullWidth
            sx={{ order: { xs: 1, sm: 2 } }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NuevoPaciente;
