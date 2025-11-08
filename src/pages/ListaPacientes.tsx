import { useCamasConPaciente } from "@/hooks/useCamas";
import { usePacientes } from "@/hooks/usePacientes";
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Bed as BedIcon,
  CheckCircle as CheckCircleIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Science as ScienceIcon,
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

// Componente principal
const ListaPacientes: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: pacientes,
    isLoading: loadingPacientes,
    error: errorPacientes,
  } = usePacientes({ todosPacientes: true });

  const {
    data: camas,
    isLoading: loadingCamas,
    error: errorCamas,
  } = useCamasConPaciente();

  console.log("hola camas", camas);

  const [tabValue, setTabValue] = useState(0);

  const isLoading = loadingPacientes || loadingCamas;
  const error = errorPacientes || errorCamas;

  const irDetallePaciente = (pacienteId: string) => {
    navigate(`/pacientes/${pacienteId}`);
  };

  const agregarPase = (pacienteId: string) => {
    navigate(`/pases/nuevo?pacienteId=${pacienteId}`);
  };

  const agregarCultivos = (pacienteId: string) => {
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
          <Typography variant="body2">
            No se pudieron cargar los datos.
          </Typography>
        </Alert>
      </Container>
    );
  }

  // const pacientesActivos = pacientes?.filter(paciente => paciente.activo) ?? [];
  const pacientesInactivos =
    pacientes?.filter(paciente => !paciente.activo) ?? [];

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
          Gestión de Camas y Pacientes
        </Typography>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(_event, newValue) => setTabValue(newValue)}
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        <Tab label={`Vista de Camas (${camas?.length || 0})`} />
        <Tab label={`Pacientes Inactivos (${pacientesInactivos.length})`} />
      </Tabs>

      {/* Tab 0: Vista de todas las camas */}
      {tabValue === 0 && camas && (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {camas.map(cama => {
            const estaOcupada = !cama.disponible;
            const estaDisponible = cama.disponible;

            return (
              <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={cama.id}>
                <Card
                  elevation={2}
                  sx={{
                    cursor: estaOcupada ? "pointer" : "default",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                    bgcolor: estaDisponible ? "success.50" : "background.paper",
                    border: estaDisponible ? "2px solid" : "none",
                    borderColor: estaDisponible
                      ? "success.main"
                      : "transparent",
                    "&:hover": estaOcupada
                      ? {
                          boxShadow: 4,
                          transform: "translateY(-2px)",
                          transition: "all 0.2s ease-in-out",
                        }
                      : {},
                  }}
                  // onClick={() => estaOcupada && irDetallePaciente(paciente.id)}
                >
                  <CardHeader
                    avatar={
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: estaDisponible
                            ? "success.main"
                            : "primary.main",
                          color: "white",
                        }}
                      >
                        {estaDisponible ? <CheckCircleIcon /> : <PersonIcon />}
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
                          Cama {cama.cama}
                        </Typography>
                        <Chip
                          size="small"
                          label={estaDisponible ? "Disponible" : "Ocupada"}
                          color={estaDisponible ? "success" : "error"}
                          variant="filled"
                        />
                      </Box>
                    }
                    subheader={
                      estaOcupada ? (
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "medium",
                              mb: 0.5,
                              fontSize: { xs: "0.875rem", sm: "1rem" },
                            }}
                          >
                            {/* {paciente.nombre} {paciente.apellido} */}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            {/* Ingreso: {formatFecha(paciente.fecha_ingreso)} */}
                          </Typography>
                          {/* {paciente.motivo_ingreso && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                mt: 0.5,
                              }}
                            >
                              Motivo: {paciente.motivo_ingreso}
                            </Typography>
                          )} */}
                        </Box>
                      ) : (
                        <Typography
                          variant="body2"
                          color="success.dark"
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            fontWeight: "medium",
                          }}
                        >
                          Cama lista para asignar
                        </Typography>
                      )
                    }
                    sx={{ flexGrow: 1, pb: 1 }}
                  />
                  {estaOcupada && (
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
                          // agregarPase(paciente.id);
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
                          // agregarCultivos(paciente.id);
                        }}
                        sx={{
                          borderRadius: 2,
                          width: { xs: "100%", sm: "auto" },
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Agregar Cultivo
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Tab 1: Pacientes inactivos */}
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
                        {paciente.nombre} {paciente.apellido}
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
