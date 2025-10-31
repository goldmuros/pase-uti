import { useCultivos } from "@/hooks/useCultivos";
import { usePacientes } from "@/hooks/usePacientes";
import {
  Add as AddIcon,
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
import { useNavigate } from "react-router-dom";

const ListaCultivos: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pacienteId = new URLSearchParams(window.location.search).get(
    "pacienteId"
  );

  const { data: cultivos = [], isLoading, error } = useCultivos(pacienteId);
  const { data: pacientes = [] } = usePacientes();

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

  const getEstadoCultivo = (fechaRecibido: string | null) => {
    if (!fechaRecibido)
      return { label: "Pendiente", color: "warning" as const };

    const hoy = new Date();
    const fechaRecibida = new Date(fechaRecibido);
    const diffTime = hoy.getTime() - fechaRecibida.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return { label: "Reciente", color: "success" as const };
    if (diffDays <= 7) return { label: "Esta semana", color: "info" as const };
    return { label: "Antiguo", color: "default" as const };
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

      {/* Estadísticas rápidas */}
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
              {cultivos.length}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Total de Cultivos
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, sm: 4 }}>
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
              {
                cultivos.filter(
                  c => getEstadoCultivo(c.fecha_recibido).color === "success"
                ).length
              }
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Recientes
            </Typography>
          </Paper>
        </Grid>
        <Grid sx={{ xs: 12, sm: 4 }}>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2 },
              textAlign: "center",
              backgroundColor: "info.main",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{ fontWeight: "bold" }}
            >
              {cultivos.filter(c => c.resultado.includes("Sensible")).length}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
            >
              Sensibles
            </Typography>
          </Paper>
        </Grid>
      </Grid>

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
            No hay cultivos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Comience agregando un nuevo cultivo al sistema.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={agregarNuevoCultivo}
            sx={{ borderRadius: 2 }}
            size={isMobile ? "medium" : "large"}
          >
            Agregar Primer Cultivo
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          {cultivos.map(cultivo => {
            const estado = getEstadoCultivo(cultivo.fecha_recibido);
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
                    avatar={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ScienceIcon color="primary" />
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
                          {cultivo.nombre}
                        </Typography>
                        <Chip
                          size="small"
                          label={estado.label}
                          color={estado.color}
                          variant="filled"
                        />
                      </Box>
                    }
                    subheader={
                      <Box>
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
                    sx={{ px: 2, pb: 2, justifyContent: "flex-end" }}
                  >
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
  );
};

export default ListaCultivos;
