import {
  useCreateCultivo,
  useCultivo,
  useUpdateCultivo,
} from "@/hooks/useCultivos";
import { usePacientes } from "@/hooks/usePacientes";
import type { Cultivos } from "@/types/Cultivos";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";

const CULTIVOS = [
  { id: "hemocultivo", nombre: "Hemocultivo" },
  { id: "urocultivo", nombre: "Urocultivo" },
  { id: "minibal", nombre: "Minibal" },
  { id: "lcr", nombre: "LCR (Liquido cefaloraquideo)" },
  { id: "retrocultivo", nombre: "Retrocultivo" },
  { id: "purulento", nombre: "Purulento (otros)" },
];

const DEFAULT_CULTIVO = {
  paciente_id: "",
  fecha_solicitud: "",
  fecha_recibido: "",
  nombre: "",
  resultado: "",
  estado: "pendiente",
};
const Cultivo = (): ReactNode => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const updateCultivo = useUpdateCultivo();
  const createCultivo = useCreateCultivo();
  const { data: cultivo } = useCultivo(id);

  const { data: pacientes } = usePacientes({ todosPacientes: false });

  const [formCultivo, setFormCultivo] =
    useState<Omit<Cultivos, "id" | "created_at" | "activo">>(DEFAULT_CULTIVO);

  const handleCancel = () => {
    navigate("/cultivos");
  };

  useEffect(() => {
    if (cultivo) {
      setFormCultivo(cultivo);
    }
  }, [cultivo]);

  const handleChange =
    (field: keyof typeof formCultivo) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormCultivo(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await createCultivo.mutateAsync({
        ...formCultivo,
        fecha_recibido: formCultivo.fecha_recibido || null,
        activo: true,
      });

      // Navigate back to list on success
      navigate("/cultivos");
    } catch (error) {
      console.error("Error creating cultivo:", error);
      // Error is handled by the mutation
    }
  };

  const mostrarEstado = formCultivo.fecha_recibido !== "";

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
              value={formCultivo.paciente_id}
              onChange={event =>
                setFormCultivo(prev => ({
                  ...prev,
                  paciente_id: event.target.value,
                }))
              }
              label="Paciente"
            >
              {pacientes?.map(paciente => (
                <MenuItem key={paciente.id} value={paciente.id}>
                  {paciente.nombre} {paciente.apellido} - Cama {paciente.cama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth required>
            <InputLabel>Nombre del Cultivo</InputLabel>
            <Select
              value={formCultivo.nombre}
              onChange={event =>
                setFormCultivo(prev => ({
                  ...prev,
                  nombre: event.target.value,
                }))
              }
              label="Nombre del Cultivo"
            >
              {CULTIVOS.map(cultivo => (
                <MenuItem key={cultivo.id} value={cultivo.id}>
                  {cultivo.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <TextField
              fullWidth
              label="Fecha de Solicitud"
              type="date"
              value={formCultivo.fecha_solicitud}
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
              type="date"
              value={formCultivo.fecha_recibido}
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
            value={formCultivo.resultado}
            onChange={handleChange("resultado")}
            multiline
            rows={4}
            placeholder="Describa el resultado del cultivo..."
          />
        </Box>
        {mostrarEstado && (
          <Box sx={{ mb: 3 }}>
            <FormControl>
              <FormLabel>Estado</FormLabel>
              <RadioGroup
                aria-labelledby="estado"
                name="radio-buttons-group"
                onChange={handleChange("estado")}
                row
              >
                <FormControlLabel
                  control={<Radio color="error" />}
                  label="Positivo"
                  value="positivo"
                />
                <FormControlLabel
                  control={<Radio color="success" />}
                  label="Negativo"
                  value="negativo"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )}
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

export default Cultivo;
