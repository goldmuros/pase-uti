import {
  useCreateCultivo,
  useCultivo,
  useUpdateCultivo,
} from "@/hooks/useCultivos";
import { usePacientes } from "@/hooks/usePacientes";
import type { Cultivos } from "@/types/Cultivos";
import { formatDateTimeLocal } from "@/utils/fechas";
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
import { useNavigate, useParams, useSearchParams } from "react-router";

export const CULTIVOS = [
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
  estado: "",
};

const Cultivo = (): ReactNode => {
  const { id: cultivoId = "" } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const updateCultivo = useUpdateCultivo();
  const createCultivo = useCreateCultivo();
  const { data: cultivo } = useCultivo(cultivoId);

  const { data: pacientes } = usePacientes({ todosPacientes: false });

  const [formCultivo, setFormCultivo] =
    useState<Omit<Cultivos, "id" | "created_at" | "activo">>(DEFAULT_CULTIVO);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCancel = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (cultivo) {
      setFormCultivo(cultivo);
    }

    const pacienteIdFromUrl = searchParams.get("pacienteId");
    if (pacienteIdFromUrl && !cultivoId) {
      setFormCultivo(prev => ({
        ...prev,
        paciente_id: pacienteIdFromUrl,
      }));
    }
  }, [cultivo]);

  const handleChange =
    (field: keyof typeof formCultivo) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormCultivo(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
      // Limpiar error del campo cuando el usuario edita
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
      }
    };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validación: Paciente requerido
    if (!formCultivo.paciente_id.trim()) {
      newErrors.paciente_id = "El paciente es requerido";
    }

    // Validación: Nombre del cultivo requerido
    if (!formCultivo.nombre.trim()) {
      newErrors.nombre = "El nombre del cultivo es requerido";
    }

    // Validación: Fecha de solicitud requerida
    if (!formCultivo.fecha_solicitud.trim()) {
      newErrors.fecha_solicitud = "La fecha de solicitud es requerida";
    }

    // Validación: Si hay resultado, debe haber fecha_recibido
    if (formCultivo.resultado.trim() && !formCultivo.fecha_recibido?.trim()) {
      newErrors.fecha_recibido =
        "Debe ingresar la fecha de recibido si hay un resultado";
    }

    // Validación: Si hay resultado, debe haber estado
    if (formCultivo.resultado.trim() && !formCultivo.estado.trim()) {
      newErrors.estado =
        "Debe seleccionar un estado (Positivo o Negativo) si hay un resultado";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validar formulario
    if (!validateForm()) {
      return;
    }

    let fechaRecibido = null;

    if (formCultivo.fecha_recibido) {
      fechaRecibido = formCultivo.fecha_recibido;
    } else if (Boolean(formCultivo.resultado)) {
      fechaRecibido = formatDateTimeLocal(new Date().toString());
    }

    try {
      if (cultivoId) {
        await updateCultivo.mutateAsync({
          id: cultivoId,
          ...formCultivo,
          fecha_recibido: fechaRecibido,
          estado: fechaRecibido ? formCultivo.estado : "pendiente",
          activo: true,
        });
      } else {
        await createCultivo.mutateAsync({
          ...formCultivo,
          fecha_recibido: fechaRecibido,
          estado: fechaRecibido ? formCultivo.estado : "pendiente",
          activo: true,
        });
      }

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
        {cultivoId ? "Modificar" : "Crear Nuevo"} Cultivo
      </Typography>

      {createCultivo.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al crear el cultivo: {createCultivo.error?.message}
        </Alert>
      )}

      {updateCultivo.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error al actualizar el cultivo: {updateCultivo.error?.message}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth required error={!!errors.paciente_id}>
            <InputLabel>Paciente</InputLabel>
            <Select
              value={formCultivo.paciente_id}
              onChange={event => {
                setFormCultivo(prev => ({
                  ...prev,
                  paciente_id: event.target.value,
                }));
                if (errors.paciente_id) {
                  setErrors(prev => ({ ...prev, paciente_id: "" }));
                }
              }}
              label="Paciente"
            >
              {pacientes?.map(paciente => (
                <MenuItem key={paciente.id} value={paciente.id}>
                  {paciente.nombre} {paciente.apellido}
                </MenuItem>
              ))}
            </Select>
            {errors.paciente_id && (
              <Typography variant="caption" color="error">
                {errors.paciente_id}
              </Typography>
            )}
          </FormControl>
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth required error={!!errors.nombre}>
            <InputLabel>Nombre del Cultivo</InputLabel>
            <Select
              value={formCultivo.nombre}
              onChange={event => {
                setFormCultivo(prev => ({
                  ...prev,
                  nombre: event.target.value,
                }));
                if (errors.nombre) {
                  setErrors(prev => ({ ...prev, nombre: "" }));
                }
              }}
              label="Nombre del Cultivo"
            >
              {CULTIVOS.map(cultivo => (
                <MenuItem key={cultivo.id} value={cultivo.id}>
                  {cultivo.nombre}
                </MenuItem>
              ))}
            </Select>
            {errors.nombre && (
              <Typography variant="caption" color="error">
                {errors.nombre}
              </Typography>
            )}
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
              error={!!errors.fecha_solicitud}
              helperText={errors.fecha_solicitud}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 250 }}>
            <TextField
              fullWidth
              label="Fecha de Recibido"
              type="date"
              value={formCultivo.fecha_recibido}
              onChange={handleChange("fecha_recibido")}
              error={!!errors.fecha_recibido}
              helperText={
                errors.fecha_recibido || "Requerida si ingresa un resultado"
              }
              InputLabelProps={{ shrink: true }}
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
            helperText="Si ingresa un resultado, debe proporcionar la fecha de recibido"
          />
        </Box>

        {mostrarEstado && (
          <Box sx={{ mb: 3 }}>
            <FormControl error={!!errors.estado}>
              <FormLabel>Estado</FormLabel>
              <RadioGroup
                aria-labelledby="estado"
                name="radio-buttons-group"
                onChange={handleChange("estado")}
                value={formCultivo.estado}
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
              {errors.estado && (
                <Typography variant="caption" color="error">
                  {errors.estado}
                </Typography>
              )}
            </FormControl>
          </Box>
        )}

        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={createCultivo.isPending || updateCultivo.isPending}
          >
            {createCultivo.isPending || updateCultivo.isPending
              ? "Guardando..."
              : cultivoId
                ? "Modificar cultivo"
                : "Crear cultivo"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={createCultivo.isPending || updateCultivo.isPending}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Cultivo;
