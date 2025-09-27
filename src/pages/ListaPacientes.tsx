import { mockCamas } from "@/mock/camas";
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Bed as BedIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Chip,
  Container,
  Fab,
  Grid,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePacientesData } from "../hooks/usePacienteData";

// Componente principal
const ListaPacientes: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { pacientes, isLoading, error } = usePacientesData();
  const [tabValue, setTabValue] = useState(0);

  const irDetallePaciente = (pacienteId: string) => {
    navigate(`/pacientes/${pacienteId}`);
  };

  const agregarPase = (
    pacienteId: string,
    camaId: string | null | undefined
  ) => {
    navigate(`/pases/nuevo?pacienteId=${pacienteId}&cama=${camaId || ""}`);
  };

  const agregarCultivos = (
    pacienteId: string,
    camaId: string | null | undefined
  ) => {
    navigate(`/cultivos/nuevo?pacienteId=${pacienteId}`);
  };

  const agregarNuevoPaciente = () => {
    navigate("/pacientes/nuevo");
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Estados de carga
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 1, md: 2, lg: 3 } }}>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          {Array.from({ length: 6 }, (_, index) => (
            <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="xl"
        sx={{ px: { xs: 0.5, sm: 1, md: 2, lg: 3 }, textAlign: "center" }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {error}
          </Typography>
          <Typography variant="body2">
            No se pudieron cargar los pacientes.
          </Typography>
        </Alert>
      </Container>
    );
  }

  const pacientesActivos = pacientes.filter(p => p.activo);
  const pacientesInactivos = pacientes.filter(p => !p.activo);

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
        position: "relative",
        width: "100%",
        maxWidth: "100% !important",
      }}
    >
      {/* Header - Responsive */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            flexGrow: 1,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            mb: { xs: 1, sm: 0 },
          }}
        >
          <HospitalIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Gestión de Pacientes
        </Typography>
      </Box>

      {/* Estadísticas rápidas - Responsive */}
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
      >
        <Grid sx={{ xs: 12, sm: 4 }}>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2 },
              textAlign: "center",
              backgroundColor: "primary.main",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold" }}
            >
              {pacientesActivos.length}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Pacientes Activos
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2 },
              textAlign: "center",
              backgroundColor: "text.secondary",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold" }}
            >
              {pacientesInactivos.length}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Pacientes Inactivos
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, sm: 6, md: 4 }}>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2 },
              textAlign: "center",
              backgroundColor: "success.main",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold" }}
            >
              {pacientes.length}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Total de Pacientes
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {pacientes.length === 0 ? (
        <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <PersonIcon
            sx={{
              fontSize: { xs: 48, sm: 64 },
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay pacientes registrados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comience agregando un nuevo paciente al sistema.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={agregarNuevoPaciente}
            sx={{ borderRadius: 2 }}
            size={isMobile ? "medium" : "large"}
          >
            Agregar Primer Paciente
          </Button>
        </Paper>
      ) : (
        <>
          <Tabs
            value={tabValue}
            onChange={(event, newValue) => setTabValue(newValue)}
            sx={{ mb: { xs: 2, sm: 3 } }}
          >
            <Tab label={`Activos (${pacientesActivos.length})`} />
            <Tab label={`Inactivos (${pacientesInactivos.length})`} />
          </Tabs>

          {tabValue === 0 && pacientesActivos.length > 0 && (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {pacientesActivos.map(paciente => (
                <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={paciente.id}>
                  <Card
                    elevation={2}
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                    onClick={() => irDetallePaciente(paciente.id)}
                  >
                    <CardHeader
                      avatar={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon color="primary" />
                        </Box>
                      }
                      title={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            variant={isMobile ? "body1" : "h6"}
                            sx={{ fontWeight: "bold" }}
                          >
                            <BedIcon fontSize="small" sx={{ mr: 1 }} />
                            {paciente.cama
                              ? (() => {
                                  const cama = mockCamas.find(
                                    c => c.id === paciente.cama
                                  );
                                  return cama
                                    ? `Cama ${cama.numero} (${cama.sala})`
                                    : "Cama no asignada";
                                })()
                              : "Cama no asignada"}
                          </Typography>
                          <Chip
                            size="small"
                            label="Activo"
                            color="success"
                            variant="filled"
                          />
                        </Box>
                      }
                      subheader={
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "medium",
                              mb: 0.5,
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          >
                            {paciente.nombre} {paciente.apellido}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            Ingreso: {formatFecha(paciente.fecha_ingreso)}
                          </Typography>
                        </Box>
                      }
                      sx={{ flexGrow: 1, pb: 1 }}
                    />
                    <CardActions
                      sx={{
                        justifyContent: "space-between",
                        px: 2,
                        pb: 2,
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 0 },
                      }}
                    >
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<AssignmentIcon />}
                        onClick={event => {
                          event.stopPropagation();
                          agregarPase(paciente.id, paciente.cama);
                        }}
                        sx={{
                          borderRadius: 2,
                          width: { xs: "100%", sm: "auto" },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Agregar Pase
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        startIcon={<ScienceIcon />}
                        onClick={event => {
                          event.stopPropagation();
                          agregarCultivos(paciente.id, paciente.cama);
                        }}
                        sx={{
                          borderRadius: 2,
                          width: { xs: "100%", sm: "auto" },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Cultivos
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {tabValue === 1 && pacientesInactivos.length > 0 && (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {pacientesInactivos.map(paciente => (
                <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={paciente.id}>
                  <Card
                    elevation={1}
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      opacity: 0.7,
                      border: "2px dashed #ccc",
                      "&:hover": {
                        opacity: 0.9,
                        boxShadow: 2,
                      },
                    }}
                    onClick={() => irDetallePaciente(paciente.id)}
                  >
                    <CardHeader
                      avatar={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon color="disabled" />
                        </Box>
                      }
                      title={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            variant={isMobile ? "body1" : "h6"}
                            color="text.secondary"
                          >
                            <BedIcon fontSize="small" sx={{ mr: 1 }} />
                            {paciente.cama
                              ? (() => {
                                  const cama = mockCamas.find(
                                    c => c.id === paciente.cama
                                  );
                                  return cama
                                    ? `Cama ${cama.numero} (${cama.sala})`
                                    : "Cama no asignada";
                                })()
                              : "Cama no asignada"}
                          </Typography>
                          <Chip
                            size="small"
                            label="Inactivo"
                            color="default"
                            variant="outlined"
                          />
                        </Box>
                      }
                      subheader={
                        <Box>
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                              mb: 0.5,
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          >
                            {paciente.nombre} {paciente.apellido}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            sx={{
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            Ingreso: {formatFecha(paciente.fecha_ingreso)}
                          </Typography>
                        </Box>
                      }
                      sx={{ flexGrow: 1 }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Botón flotante para agregar paciente - Responsive */}
      <Tooltip title="Agregar nuevo paciente">
        <Fab
          color="primary"
          aria-label="add"
          onClick={agregarNuevoPaciente}
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            boxShadow: 4,
            width: { xs: 48, sm: 56 },
            height: { xs: 48, sm: 56 },
            zIndex: theme.zIndex.speedDial,
          }}
          size={isMobile ? "medium" : "large"}
        >
          <AddIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </Fab>
      </Tooltip>
    </Container>
  );
};

export default ListaPacientes;
