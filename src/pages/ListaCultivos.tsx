import { useCultivos, useDeleteCultivo } from "@/hooks/useCultivos";
import { usePacientes } from "@/hooks/usePacientes";
import {
  Add as AddIcon,
  Bed as BedIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Fab,
  Grid,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const getEstadoCultivo = (estado: string | null) => {
  if (!estado) {
    return {
      color: "info" as const,
      label: "Pendiente",
    };
  }

  if (estado === "positivo") {
    return {
      color: "error" as const,
      label: "Positivo",
    };
  }

  return {
    color: "success" as const,
    label: "Negativo",
  };
};

const ListaCultivos: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pacienteId = new URLSearchParams(window.location.search).get(
    "pacienteId"
  );

  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(new Date());

  const {
    data: cultivos = [],
    isLoading,
    error,
  } = useCultivos(pacienteId, fechaFiltro);
  const { data: pacientes = [] } = usePacientes({ todosPacientes: false });

  const deleteCultivo = useDeleteCultivo();

  const pacienteFiltrado = pacienteId
    ? pacientes.find(p => p.id === pacienteId)
    : null;

  const agregarNuevoCultivo = () => {
    navigate("/cultivos/nuevo");
  };

  const editarCultivo = (id: string) => {
    navigate(`/cultivos/${id}/editar`);
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const buscarPaciente = (pacienteId: string) => {
    return pacientes.find(paciente => paciente.id === pacienteId);
  };

  const eliminarCultivo = async (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este cultivo?")) {
      try {
        await deleteCultivo.mutateAsync(id);
      } catch (error) {
        console.error("Error al eliminar cultivo:", error);
        alert("Error al eliminar el cultivo");
      }
    }
  };

  const limpiarFiltro = () => {
    setFechaFiltro(null);
  };

  // Estado de carga
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

  // Estado de error
  if (error) {
    return (
      <Container
        maxWidth="xl"
        sx={{ px: { xs: 0.5, sm: 1, md: 2, lg: 3 }, textAlign: "center" }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Error al cargar los cultivos
          </Typography>
          <Typography variant="body2">
            {error instanceof Error ? error.message : "Error desconocido"}
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          position: "relative",
          width: "100%",
          maxWidth: "100% !important",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
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
            <ScienceIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {pacienteId && pacienteFiltrado
              ? `Cultivos de ${pacienteFiltrado.nombre} ${pacienteFiltrado.apellido}`
              : "Gestión de Cultivos"}
          </Typography>
        </Box>

        {/* Filtro de fecha */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <DatePicker
            label="Filtrar por fecha de solicitud"
            value={fechaFiltro}
            onChange={newValue => setFechaFiltro(newValue)}
            slotProps={{
              textField: {
                size: isMobile ? "small" : "medium",
                fullWidth: isMobile,
                sx: { minWidth: { sm: 250 } },
              },
            }}
          />
          {fechaFiltro && (
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={limpiarFiltro}
              size={isMobile ? "small" : "medium"}
              sx={{ borderRadius: 2 }}
            >
              Limpiar filtro
            </Button>
          )}
        </Box>

        {/* Lista vacía */}
        {cultivos.length === 0 ? (
          <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
            <ScienceIcon
              sx={{
                fontSize: { xs: 48, sm: 64 },
                color: "text.secondary",
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {fechaFiltro
                ? "No hay cultivos registrados para esta fecha"
                : "No hay cultivos registrados"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {fechaFiltro
                ? "Intente con otra fecha o limpie el filtro."
                : "Comience agregando un nuevo cultivo al sistema."}
            </Typography>
            {!fechaFiltro ? (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={agregarNuevoCultivo}
                sx={{ borderRadius: 2 }}
                size={isMobile ? "medium" : "large"}
              >
                Agregar Primer Cultivo
              </Button>
            ) : (
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={limpiarFiltro}
                sx={{ borderRadius: 2 }}
                size={isMobile ? "medium" : "large"}
              >
                Limpiar filtro
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
            {cultivos.map(cultivo => {
              return (
                <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={cultivo.id}>
                  <Card
                    elevation={2}
                    sx={{
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
                  >
                    <CardHeader
                      title={
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-around",
                              gap: 1,
                              flexWrap: "wrap",
                              flexDirection: "row",
                            }}
                          >
                            <Typography
                              variant={isMobile ? "body1" : "h6"}
                              sx={{ fontWeight: "bold" }}
                            >
                              <BedIcon fontSize="small" sx={{ mr: 1 }} />
                              {buscarPaciente(cultivo.paciente_id)?.cama}
                            </Typography>
                            <Typography
                              variant={isMobile ? "body1" : "h6"}
                              sx={{ fontWeight: "bold" }}
                            >
                              {`${buscarPaciente(cultivo.paciente_id)?.nombre}
                                ${buscarPaciente(cultivo.paciente_id)?.apellido}`}
                            </Typography>
                          </Box>
                          <Chip
                            size="small"
                            variant="filled"
                            {...getEstadoCultivo(cultivo.estado)}
                          />
                        </Box>
                      }
                      subheader={
                        <Box>
                          <Box>
                            <Typography
                              variant={isMobile ? "body1" : "h6"}
                              sx={{ fontWeight: "bold" }}
                            >
                              {cultivo.nombre}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 0.5,
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            Solicitado: {formatFecha(cultivo.fecha_solicitud)}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            Recibido:{" "}
                            {cultivo.fecha_recibido
                              ? formatFecha(cultivo.fecha_recibido)
                              : "Pendiente"}
                          </Typography>
                        </Box>
                      }
                      sx={{ flexGrow: 1, pb: 1 }}
                    />
                    <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          color: "text.primary",
                        }}
                      >
                        <strong>Resultado:</strong> {cultivo.resultado}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{ px: 2, pb: 2, justifyContent: "flex-end", gap: 1 }}
                    >
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => eliminarCultivo(cultivo.id)}
                        disabled={deleteCultivo.isPending}
                        sx={{
                          borderRadius: 2,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Eliminar
                      </Button>
                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => editarCultivo(cultivo.id)}
                        sx={{
                          borderRadius: 2,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        Editar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Botón flotante para agregar cultivo */}
        <Tooltip title="Agregar nuevo cultivo">
          <Fab
            color="primary"
            aria-label="add"
            onClick={agregarNuevoCultivo}
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
    </LocalizationProvider>
  );
};

export default ListaCultivos;
