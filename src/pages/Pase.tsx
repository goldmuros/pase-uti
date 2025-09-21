import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Bed as BedIcon,
  Clear as ClearIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockPases } from "../mock/pases";

const defaultData = {
  id: "",
  antecedentes: "",
  gcs_rass: "",
  atb: "",
  vc_cook: "",
  actualmente: "",
  pendientes: "",
  pacienteId: "",
  principal: "",
  antibioticos: "",
  fechaCreacion: "",
  cultivos: "",
};

const Pase = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id is pase id
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [formData, setFormData] = useState(defaultData);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const paciente = {
    id: urlParams.get("pacienteId") || "",
    cama: urlParams.get("cama") || "",
  };

  // Función para generar fecha actual en formato YYYY-MM-DD HH:mm:ss
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Función para generar un ID único
  const generateId = () => {
    return "pase_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  };

  // Inicializar formulario
  useEffect(() => {
    if (id) {
      // Load existing pase
      const existingPase = mockPases.find(p => p.id === id);
      if (existingPase) {
        setFormData({
          id: existingPase.id,
          antecedentes: existingPase.antecedentes,
          gcs_rass: existingPase.gcs_rass,
          atb: existingPase.atb,
          vc_cook: existingPase.vc_cook,
          actualmente: existingPase.actualmente,
          pendientes: existingPase.pendientes,
          pacienteId: existingPase.paciente_id,
          principal: existingPase.principal,
          antibioticos: "", // not in type
          fechaCreacion: existingPase.fecha_creacion,
          cultivos: existingPase.cultivos_id,
        });
        setIsEditing(true);
      }
    } else {
      // New pase
      setFormData(prev => ({
        ...prev,
        id: generateId(),
        pacienteId: paciente.id,
        fechaCreacion: getCurrentDateTime(),
      }));
    }
  }, [id, paciente.id]);

  // Manejar cambios en los campos
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Validar campos requeridos
      if (!formData.pacienteId) {
        setSubmitMessage("Error: ID del paciente es requerido");
        return;
      }

      if (!formData.principal.trim()) {
        setSubmitMessage("Error: El diagnóstico principal es requerido");
        return;
      }

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Aquí puedes agregar la lógica para enviar los datos a tu API
      console.log("Datos del formulario:", formData);
      setSubmitMessage("Pase médico creado exitosamente");

      // Opcional: redirigir después del éxito
      setTimeout(() => {
        navigate(`/pacientes/${paciente.id}`);
      }, 2000);
    } catch (error) {
      setSubmitMessage("Error al crear el pase médico");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      ...defaultData,
      id: generateId(),
      pacienteId: paciente.id,
      fechaCreacion: getCurrentDateTime(),
    });
    setSubmitMessage("");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        width: "100%",
        maxWidth: "100% !important",
      }}
    >
      {/* Header con botón de regreso - Responsive */}
      <Box
        sx={{
          mb: { xs: 3, sm: 4 },
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" },
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Tooltip title="Volver atrás">
            <IconButton onClick={handleGoBack} sx={{ mr: { xs: 1, sm: 2 } }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              flexGrow: 1,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            <AssignmentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {isEditing ? "Ver Pase Médico" : "Nuevo Pase Médico"}
          </Typography>
        </Box>
        {paciente.cama && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: { xs: 1, sm: 0 },
              ml: { sm: 2 },
            }}
          >
            <BedIcon sx={{ mr: 1, color: "text.secondary" }} />
            <Typography
              variant={isMobile ? "body1" : "h6"}
              color="text.secondary"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              Cama: {paciente.cama}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Información del paciente - Responsive */}
      <Card
        sx={{
          mb: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: 2,
          overflow: "hidden",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2, sm: 3 },
            backgroundColor: "primary.main",
            color: "white",
          }}
        >
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
              >
                Información del Paciente
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                ID: {paciente.id}
              </Typography>
            </Grid>
            <Grid
              sx={{ textAlign: { xs: "left", sm: "right" }, xs: 12, sm: 6 }}
            >
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              >
                Fecha de Creación
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                {formatFecha(formData.fechaCreacion)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Alert de mensajes */}
      {submitMessage && (
        <Alert
          severity={submitMessage.includes("Error") ? "error" : "success"}
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setSubmitMessage("")}
        >
          {submitMessage}
        </Alert>
      )}

      {/* Formulario - Responsive */}
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={4}>
            {/* Diagnóstico Principal */}
            <Grid sx={{ xs: 12 }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                color="primary"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Diagnóstico Principal *
              </Typography>
              <TextField
                fullWidth
                name="principal"
                value={formData.principal}
                onChange={handleChange}
                variant="outlined"
                required
                disabled={isEditing}
                placeholder="Ingrese el diagnóstico principal del paciente"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Información Clínica Principal */}
            <Grid sx={{ xs: 12 }}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ fontWeight: "bold", mt: 2 }}
              >
                Información Clínica
              </Typography>
            </Grid>

            <Grid sx={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "medium" }}
              >
                Antecedentes
              </Typography>
              <TextField
                fullWidth
                name="antecedentes"
                value={formData.antecedentes}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                placeholder="Antecedentes médicos relevantes del paciente"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid sx={{ xs: 12, md: 6 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "medium" }}
              >
                Estado Actual
              </Typography>
              <TextField
                fullWidth
                name="actualmente"
                value={formData.actualmente}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={4}
                placeholder="Descripción del estado actual del paciente"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "medium" }}
              >
                Pendientes
              </Typography>
              <TextField
                fullWidth
                name="pendientes"
                value={formData.pendientes}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                placeholder="Tareas pendientes, estudios por realizar, seguimientos necesarios"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Parámetros Clínicos */}
            <Grid sx={{ xs: 12 }}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ fontWeight: "bold", mt: 2 }}
              >
                Parámetros Clínicos
              </Typography>
            </Grid>

            <Grid sx={{ xs: 12, md: 4 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "medium" }}
              >
                GCS/RASS
              </Typography>
              <TextField
                fullWidth
                name="gcs_rass"
                value={formData.gcs_rass}
                onChange={handleChange}
                variant="outlined"
                placeholder="Ej: 15/0"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid sx={{ xs: 12, md: 4 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "medium" }}
              >
                ATB
              </Typography>
              <TextField
                fullWidth
                name="atb"
                value={formData.atb}
                onChange={handleChange}
                variant="outlined"
                placeholder="Antibiótico principal"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid sx={{ xs: 12, md: 4 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "medium" }}
              >
                VC Cook
              </Typography>
              <TextField
                fullWidth
                name="vc_cook"
                value={formData.vc_cook}
                onChange={handleChange}
                variant="outlined"
                placeholder="Valor Cook"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Tratamiento */}
            <Grid sx={{ xs: 12 }}>
              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ fontWeight: "bold", mt: 2 }}
              >
                Tratamiento
              </Typography>
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "medium" }}
              >
                Antibióticos
              </Typography>
              <TextField
                fullWidth
                name="antibioticos"
                value={formData.antibioticos}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                placeholder="Detalle del esquema antibiótico: medicamentos, dosis, frecuencia, duración"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            <Grid sx={{ xs: 12 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "medium" }}
              >
                Cultivos
              </Typography>
              <TextField
                fullWidth
                name="cultivos"
                value={formData.cultivos}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                placeholder="Información sobre cultivos realizados, pendientes y resultados"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>

            {/* Botones de acción - Responsive */}
            <Grid sx={{ xs: 12 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 2, sm: 2 },
                  justifyContent: "center",
                  mt: { xs: 3, sm: 4 },
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size={isMobile ? "medium" : "large"}
                  disabled={isSubmitting}
                  startIcon={<SaveIcon />}
                  fullWidth={isMobile}
                  sx={{
                    borderRadius: 2,
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.25, sm: 1.5 },
                    fontWeight: "bold",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {isSubmitting ? "Guardando..." : "Crear Pase"}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  size={isMobile ? "medium" : "large"}
                  onClick={resetForm}
                  disabled={isSubmitting}
                  startIcon={<ClearIcon />}
                  fullWidth={isMobile}
                  sx={{
                    borderRadius: 2,
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.25, sm: 1.5 },
                    fontWeight: "bold",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Limpiar Formulario
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default Pase;
