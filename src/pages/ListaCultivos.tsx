import {
  Add as AddIcon,
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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Cultivos } from "../types/Cultivos";

// Mock data
const mockCultivos: Cultivos[] = [
  {
    id: "cult1",
    fechaSolicitud: new Date("2024-03-15"),
    fechaRecibido: new Date("2024-03-17"),
    nombre: "Hemocultivo",
    resultado: "Staphylococcus aureus - Sensible a Vancomicina",
    pacienteId: "1",
  },
  {
    id: "cult2",
    fechaSolicitud: new Date("2024-03-16"),
    fechaRecibido: new Date("2024-03-18"),
    nombre: "Urocultivo",
    resultado: "Escherichia coli - Resistente a Ampicilina",
    pacienteId: "1",
  },
  {
    id: "cult3",
    fechaSolicitud: new Date("2024-03-18"),
    fechaRecibido: new Date("2024-03-20"),
    nombre: "Cultivo de esputo",
    resultado: "Pseudomonas aeruginosa - Sensible a Meropenem",
    pacienteId: "1",
  },
];

// Tipos para el estado del componente
interface ListaCultivosState {
  cultivos: Cultivos[];
  isLoading: boolean;
  error: string | null;
}

// Hook personalizado para obtener datos de cultivos
const useCultivosData = () => {
  const [state, setState] = useState<ListaCultivosState>({
    cultivos: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300));

        // Ordenar cultivos por fecha de solicitud (más recientes primero)
        const cultivosOrdenados = mockCultivos.sort(
          (a, b) =>
            new Date(b.fechaSolicitud).getTime() -
            new Date(a.fechaSolicitud).getTime()
        );

        setState({
          cultivos: cultivosOrdenados,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Error al cargar los cultivos",
        }));
      }
    };

    fetchData();
  }, []);

  return state;
};

// Componente principal
const ListaCultivos: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const { cultivos, isLoading, error } = useCultivosData();

  const agregarNuevoCultivo = () => {
    navigate("/cultivos/nuevo");
  };

  const formatFecha = (fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getEstadoCultivo = (fechaRecibido: Date) => {
    const hoy = new Date();
    const diffTime = hoy.getTime() - fechaRecibido.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return { label: "Reciente", color: "success" as const };
    if (diffDays <= 7) return { label: "Esta semana", color: "info" as const };
    return { label: "Antiguo", color: "default" as const };
  };

  // Estados de carga
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 1, md: 2, lg: 3 } }}>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
          {Array.from({ length: 6 }, (_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
            No se pudieron cargar los cultivos.
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
          <ScienceIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Gestión de Cultivos
        </Typography>
      </Box>

      {/* Estadísticas rápidas - Responsive */}
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        sx={{ mb: { xs: 2, sm: 3, md: 4 } }}
      >
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
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
                  c => getEstadoCultivo(c.fechaRecibido).color === "success"
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
        <Grid item xs={12} sm={4}>
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
            const estado = getEstadoCultivo(cultivo.fechaRecibido);
            return (
              <Grid item xs={12} sm={6} lg={4} key={cultivo.id}>
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
                          Solicitado: {formatFecha(cultivo.fechaSolicitud)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        >
                          Recibido: {formatFecha(cultivo.fechaRecibido)}
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
                      variant="outlined"
                      onClick={() =>
                        navigate(`/pacientes/${cultivo.pacienteId}`)
                      }
                      sx={{
                        borderRadius: 2,
                        width: { xs: "100%", sm: "auto" },
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      Ver Paciente
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Botón flotante para agregar cultivo - Responsive */}
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
