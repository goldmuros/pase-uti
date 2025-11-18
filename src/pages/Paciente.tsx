import { formatFecha } from "@/utils/fechas";
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Assignment as AssignmentIcon,
  Bed as BedIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  updatePaciente,
  usePacienteDetalle,
} from "../hooks/usePacienteDetalle";

// Componente principal
const Paciente: React.FC = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { paciente, pases, cultivos, cama, isLoading, error } =
    usePacienteDetalle(id);

  // Estado para el diálogo de baja
  const [openDialog, setOpenDialog] = useState(false);
  const [motivoTipo, setMotivoTipo] = useState("");
  const [motivoDetalle, setMotivoDetalle] = useState("");

  const handleGoBack = () => {
    navigate(-1);
  };

  const agregarPase = () => {
    if (paciente) {
      navigate(
        `/pases/nuevo?pacienteId=${paciente.id}&cama=${paciente.cama_id}`
      );
    }
  };

  const agregarCultivos = () => {
    if (paciente) {
      navigate(`/cultivos/nuevo?pacienteId=${paciente.id}`);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setMotivoTipo("");
    setMotivoDetalle("");
  };

  const handleMotivoTipoChange = (event: SelectChangeEvent<unknown>) => {
    setMotivoTipo(event.target.value as string);
  };

  const handleMotivoDetalleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMotivoDetalle(event.target.value);
  };

  const handleConfirmarMovimiento = async () => {
    if (paciente && motivoTipo) {
      await updatePaciente(paciente.id, {
        activo: false,
      });
      handleCloseDialog();
      // Redirect to patient list
      navigate("/pacientes");
    }
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ mb: 3, borderRadius: 2 }}
        />
        <Grid container spacing={{ xs: 2, md: 3 }}>
          <Grid sx={{ xs: 12, lg: 6 }}>
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid sx={{ xs: 12, lg: 6 }}>
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !paciente) {
    return (
      <Container
        maxWidth="xl"
        sx={{ px: { xs: 1, sm: 2, md: 3 }, textAlign: "center" }}
      >
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {error || "Paciente no encontrado"}
          </Typography>
          <Typography variant="body2">
            El paciente solicitado no existe o no se pudo cargar la información.
          </Typography>
        </Alert>
        <Button
          onClick={handleGoBack}
          color="primary"
          size="large"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
        >
          Volver Atrás
        </Button>
      </Container>
    );
  }

  const CultivoCard = () => {
    const detalleCultivo = (id: string) => {
      navigate(`/cultivos/${id}/editar`);
    };
    return (
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: 2,
          height: "fit-content",
        }}
      >
        {cultivos ? (
          <Accordion
            defaultExpanded
            onClick={() => detalleCultivo(cultivos.id)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <ScienceIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                Último Cultivo
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body1"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 2 }}
              >
                Solicitado: {formatFecha(cultivos.fecha_solicitud)}
              </Typography>
              {cultivos.nombre && (
                <Typography
                  variant="body1"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 2 }}
                >
                  Cultivo: {cultivos.nombre}
                </Typography>
              )}
              <Typography
                variant="body1"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 2 }}
              >
                Recibido:{" "}
                {cultivos.fecha_recibido ? (
                  formatFecha(cultivos.fecha_recibido)
                ) : (
                  <Chip
                    size="small"
                    label="Pendiente"
                    color="info"
                    variant="filled"
                  />
                )}
              </Typography>
              {cultivos.resultado && (
                <Typography
                  variant="body1"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 2 }}
                >
                  <strong>Resultado:</strong> {cultivos.resultado}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <ScienceIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay cultivos
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Este paciente no tiene cultivos registrados.
            </Typography>
          </Box>
        )}
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/cultivos?pacienteId=${paciente.id}`)}
          startIcon={<ScienceIcon />}
        >
          Ver Cultivos
        </Button>
      </Paper>
    );
  };

  const PaseCard = () => {
    const detallePase = (paseId: string) => {
      navigate(`/pases/${paseId}`);
    };
    return (
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          boxShadow: 2,
          height: "fit-content",
        }}
      >
        {pases ? (
          <Accordion defaultExpanded onClick={() => detallePase(pases.id)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <AssignmentIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                Último Pase Médico
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                variant="body1"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 2 }}
              >
                Fecha: {formatFecha(pases.fecha_creacion)}
              </Typography>
              {pases.principal && (
                <Typography
                  variant="body1"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 2 }}
                >
                  Principal: {pases.principal}
                </Typography>
              )}
              {pases.actualmente && (
                <Typography
                  variant="body1"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 2 }}
                >
                  Actual: {pases.actualmente}
                </Typography>
              )}
              {pases.pendientes && (
                <Typography
                  variant="body1"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 2 }}
                >
                  Pendiente: {pases.pendientes}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <AssignmentIcon
              sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No hay pases médicos
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Este paciente no tiene pases médicos registrados.
            </Typography>
          </Box>
        )}
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/pases?pacienteId=${paciente.id}`)}
          startIcon={<AssignmentIcon />}
          sx={{ mt: 2 }}
        >
          Ver Pases
        </Button>
      </Paper>
    );
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        position: "relative",
        width: "100%",
        maxWidth: "100% !important",
        overflowY: "auto",
        minHeight: "100vh",
      }}
    >
      {/* Header con botón de regreso - Responsive */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
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
            <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: "bold",
              flexGrow: 1,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            {`${paciente.nombre} ${paciente.apellido}`}
          </Typography>
        </Box>
        <Chip
          label={paciente.activo ? "Activo" : "Inactivo"}
          color={paciente.activo ? "success" : "default"}
          variant={paciente.activo ? "filled" : "outlined"}
          sx={{
            mt: { xs: 1, sm: 0 },
            ml: { sm: 2 },
            alignSelf: { xs: "flex-start", sm: "center" },
          }}
        />
      </Box>

      {/* Información básica del paciente - Responsive */}
      <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: 2,
            }}
          >
            <BedIcon sx={{ fontSize: { xs: 28, sm: 32 }, mb: 1 }} />
            <Typography
              variant={isMobile ? "h6" : "h5"}
              sx={{ fontWeight: "bold" }}
            >
              {cama?.cama}
            </Typography>
          </Paper>
        </Grid>

        <Grid sx={{ xs: 12, sm: 6, md: 3 }}>
          <Box sx={{ textAlign: "center" }}>
            <CalendarIcon sx={{ color: "text.secondary", mb: 1 }} />
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Fecha de Ingreso
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              {formatFecha(paciente.fecha_ingreso)}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Grid con cultivos y pases - Responsive */}
      <Grid container sx={{ mt: 2 }} spacing={{ xs: 2, sm: 3 }}>
        <Grid sx={{ xs: 12, lg: 6 }}>
          <CultivoCard />
        </Grid>

        <Grid sx={{ xs: 12, lg: 6 }}>
          <PaseCard />
        </Grid>
      </Grid>

      {/* Botones de acción flotantes - Responsive */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1, sm: 2 },
          zIndex: theme.zIndex.speedDial,
        }}
      >
        <Tooltip title="Mover paciente">
          <Fab
            color="error"
            onClick={handleOpenDialog}
            sx={{
              boxShadow: 4,
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
            }}
            size={isMobile ? "medium" : "large"}
          >
            <ArrowForwardIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Fab>
        </Tooltip>
        <Tooltip title="Agregar nuevo cultivo">
          <Fab
            color="secondary"
            onClick={agregarCultivos}
            sx={{
              boxShadow: 4,
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
            }}
            size={isMobile ? "medium" : "large"}
          >
            <ScienceIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Fab>
        </Tooltip>
        <Tooltip title="Agregar nuevo pase médico">
          <Fab
            color="primary"
            onClick={agregarPase}
            sx={{
              boxShadow: 4,
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
            }}
            size={isMobile ? "medium" : "large"}
          >
            <AssignmentIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
          </Fab>
        </Tooltip>
      </Box>

      {/* Diálogo de baja de paciente */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Mover Paciente</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
            <FormControl fullWidth required>
              <InputLabel>Tipo de Motivo</InputLabel>
              <Select
                value={motivoTipo}
                label="Tipo de Motivo"
                onChange={handleMotivoTipoChange}
              >
                <MenuItem value="alta_hospitalaria">Alta hospitalaria</MenuItem>
                <MenuItem value="alta_servicio">Alta del servicio</MenuItem>
                <MenuItem value="derivación">Derivación</MenuItem>
                <MenuItem value="obito">Óbito</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Detalle del Motivo"
              multiline
              rows={3}
              value={motivoDetalle}
              onChange={handleMotivoDetalleChange}
              placeholder="Ingrese detalles adicionales sobre el motivo de la baja..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarMovimiento}
            variant="contained"
            color="error"
            disabled={!motivoTipo}
          >
            Mover Paciente
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Paciente;
