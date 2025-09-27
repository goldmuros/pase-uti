import {
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
import { useNavigate } from "react-router-dom";
import { mockMedicos } from "../mock/medicos";
import { mockRoles } from "../mock/roles";
import type { Medico } from "../types/Medico";

const NuevoMedico = (): ReactNode => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<
    Omit<Medico, "id" | "created_at" | "updated_at">
  >({
    nombre: "",
    apellido: "",
    rol_id: "",
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

  const handleSelectChange = (field: keyof typeof formData) => event => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Create new medico
    const newMedico: Medico = {
      ...formData,
      id: `med_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add to mock data (in real app, this would be an API call)
    mockMedicos.push(newMedico);

    // Navigate back to list
    navigate("/medicos");
  };

  const handleCancel = () => {
    navigate("/medicos");
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Crear Nuevo Médico
      </Typography>

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
          <FormControl fullWidth required>
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.rol_id}
              label="Rol"
              onChange={handleSelectChange("rol_id")}
            >
              {mockRoles.map(rol => (
                <MenuItem key={rol.id} value={rol.id}>
                  {rol.tipo_rol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          <Button type="submit" variant="contained" color="primary">
            Crear Médico
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
