import { useCamasConPaciente } from "@/hooks/useCamas";
import { usePacientes } from "@/hooks/usePacientes";
import { formatFecha } from "@/utils/fechas";
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Bed as BedIcon,
  CheckCircle as CheckCircleIcon,
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

  const agregarNuevoPaciente = (id: string | undefined) => {
    navigate(`/pacientes/nuevo?camaId=${id}`);
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

  const pacientesInactivos =
    pacientes?.filter(paciente => !paciente.activo) ?? [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: "100% !important",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header - Responsive */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              flexGrow: 1,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2rem" },
              mb: { xs: 1, sm: 0 },
            }}
          >
            Gestión de Camas y Pacientes
          </Typography>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(_event, newValue) => setTabValue(newValue)}
          sx={{ flexShrink: 0 }}
        >
          <Tab label={`Vista de Camas (${camas?.length || 0})`} />
          <Tab label={`Pacientes Inactivos (${pacientesInactivos.length})`} />
        </Tabs>

        {/* Contenedor con scroll */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            pb: 10, // Espacio para el botón flotante
          }}
        >
          {/* Tab 0: Vista de todas las camas */}
          {tabValue === 0 && camas && (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {camas.map(cama => {
                const estaOcupada = !cama.disponible;

                return (
                  <Grid sx={{ xs: 12, sm: 12, md: 4 }} key={cama.id}>
                    <Card
                      elevation={2}
                      sx={{
                        cursor: estaOcupada ? "pointer" : "default",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 2,
                        bgcolor: estaOcupada
                          ? "background.paper"
                          : "success.50",
                        border: estaOcupada ? "none" : "2px solid",
                        borderColor: estaOcupada
                          ? "transparent"
                          : "success.main",
                        "&:hover": {
                          boxShadow: 4,
                          transform: "translateY(2px)",
                          transition: "all 0.2s ease-in-out",
                        },
                      }}
                      onClick={() =>
                        estaOcupada && irDetallePaciente(cama.pacientes.id)
                      }
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
                              bgcolor: estaOcupada
                                ? "primary.main"
                                : "success.main",
                              color: "white",
                            }}
                          >
                            {estaOcupada ? <PersonIcon /> : <CheckCircleIcon />}
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
                              label={estaOcupada ? "Ocupada" : "Disponible"}
                              color={estaOcupada ? "error" : "success"}
                              variant="filled"
                            />
                          </Box>
                        }
                        subheader={
                          estaOcupada ? (
                            <Box sx={{ minHeight: 50 }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: "medium",
                                  mb: 0.5,
                                  fontSize: { xs: "0.875rem", sm: "1rem" },
                                }}
                              >
                                {cama.pacientes.nombre}{" "}
                                {cama.pacientes.apellido}
                              </Typography>
                              {cama.pacientes.motivo_ingreso && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                    mt: 0.5,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  Motivo: {cama.pacientes.motivo_ingreso}
                                </Typography>
                              )}
                            </Box>
                          ) : (
                            <Box sx={{ minHeight: 50 }}>
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
                            </Box>
                          )
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
                          mt: "auto",
                        }}
                      >
                        {estaOcupada && (
                          <>
                            <Button
                              size="small"
                              color="primary"
                              startIcon={<AssignmentIcon />}
                              onClick={event => {
                                event.stopPropagation();
                                agregarPase(cama.pacientes.id);
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
                                agregarCultivos(cama.pacientes.id);
                              }}
                              sx={{
                                borderRadius: 2,
                                width: { xs: "100%", sm: "auto" },
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              }}
                            >
                              Agregar Cultivo
                            </Button>
                          </>
                        )}
                        {!estaOcupada && (
                          <Button
                            size="small"
                            color="primary"
                            variant="outlined"
                            startIcon={<ScienceIcon />}
                            onClick={event => {
                              event.stopPropagation();
                              agregarNuevoPaciente(cama.id);
                            }}
                            sx={{
                              borderRadius: 2,
                              width: { xs: "100%", sm: "auto" },
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            Agregar Paciente
                          </Button>
                        )}
                      </CardActions>
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
        </Box>

        {/* Botón flotante para agregar paciente - Responsive */}
        <Tooltip title="Agregar nuevo paciente">
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => agregarNuevoPaciente(undefined)}
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
    </Box>
  );
};

export default ListaPacientes;
