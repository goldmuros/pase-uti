import { useCreateMedico } from "@/hooks/useMedicos";
import {
  Alert,
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
import type { Medico } from "../types/Medico";

const NuevoMedico = (): ReactNode => {
  const navigate = useNavigate();
  const createMedico = useCreateMedico();
  const [formData, setFormData] = useState<
    Omit<Medico, "id" | "created_at" | "updated_at">
  >({
    nombre: "",
    apellido: "",
    activo: true,
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await createMedico.mutateAsync(formData);

      // Navigate back to list on success
      navigate("/medicos");
    } catch (error) {
      console.error("Error creating medico:", error);
      // Error is handled by the mutation
    }
  };

  const handleCancel = () => {
    navigate("/medicos");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Médico
      </Typography>

      {createMedico.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al crear el médico: {createMedico.error?.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={handleChange("nombre")}
              required
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <TextField
              fullWidth
              label="Apellido"
              value={formData.apellido}
              onChange={handleChange("apellido")}
              required
            />
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.activo}
                onChange={handleChange("activo")}
              />
            }
            label="Médico Activo"
          />
        </Box>

        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createMedico.isPending}
          >
            {createMedico.isPending ? "Creando..." : "Crear Médico"}
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NuevoMedico;
