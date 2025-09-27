import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { mockPacientes } from "../mock/pacientes";
import type { Paciente } from "../types/Paciente";

const NuevoPaciente = (): ReactNode => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<
    Omit<Paciente, "id" | "created_at" | "updated_at">
  >({
    nombre: "",
    apellido: "",
    cama: null,
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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Create new paciente
    const newPaciente: Paciente = {
      ...formData,
      id: Date.now().toString(),
      fecha_ingreso: new Date(formData.fecha_ingreso).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to mock data (in real app, this would be an API call)
    mockPacientes.push(newPaciente);

    // Navigate back to list
    navigate("/pacientes");
  };

  const handleCancel = () => {
    navigate("/pacientes");
  };

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
          <TextField
            fullWidth
            label="Cama"
            value={formData.cama}
            onChange={handleChange("cama")}
            required
            size="small"
            sx={{ maxWidth: { xs: "100%", sm: 200 } }}
          />
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
            sx={{ order: { xs: 2, sm: 1 } }}
          >
            Crear Paciente
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
