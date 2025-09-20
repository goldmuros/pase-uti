import ListaCultivos from "@/components/Pacientes/Dellate/ListaCultivos";
import ListaPases from "@/components/Pacientes/Dellate/ListaPases";
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Bed as BedIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Fab,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockCultivos } from "../mock/cultivos";
import { mockPacientes } from "../mock/pacientes";
import { mockPases } from "../mock/pases";
import type { Cultivos } from "../types/Cultivos";
import type { Paciente } from "../types/Paciente";
import type { Pase } from "../types/Pase";

// Tipos para el estado del componente
interface DetallePacienteState {
  paciente: Paciente | null;
  pases: Pase[];
  cultivos: Cultivos[];
  isLoading: boolean;
  error: string | null;
}

// Hook personalizado para obtener datos del paciente
const usePacienteData = (id: string) => {
  const [state, setState] = useState<DetallePacienteState>({
    paciente: null,
    pases: [],
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

        const paciente = mockPacientes.find(p => p.id === id);

        if (!paciente) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Paciente no encontrado",
          }));
          return;
        }

        const pasesPaciente = mockPases
          .filter(pase => pase.pacienteId === id)
          .sort(
            (a, b) =>
              new Date(b.fechaCreacion).getTime() -
              new Date(a.fechaCreacion).getTime()
          );

        const cultivosPaciente = mockCultivos
          .filter(cultivo => cultivo.pacienteId === id)
          .sort(
            (a, b) =>
              new Date(b.fechaRecibido).getTime() -
              new Date(a.fechaRecibido).getTime()
          );

        setState({
          paciente,
          pases: pasesPaciente,
          cultivos: cultivosPaciente,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Error al cargar los datos del paciente",
        }));
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return state;
};

// Componente principal
const DetallePaciente: React.FC = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [expandedCultivo, setExpandedCultivo] = useState<string | false>(false);
  const [expandedPase, setExpandedPase] = useState<string | false>(false);

  const { paciente, pases, cultivos, isLoading, error } = usePacienteData(id);

  const handleCultivoChange = useCallback(
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedCultivo(isExpanded ? panel : false);
    },
    []
  );

  const handlePaseChange = useCallback(
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedPase(isExpanded ? panel : false);
    },
    []
  );

  const handleGoBack = () => {
    navigate(-1);
  };

  const agregarPase = () => {
    if (paciente) {
      navigate(`/pases/${paciente.id}?cama=${paciente.cama}`);
    }
  };

  const agregarCultivos = () => {
    if (paciente) {
      navigate(`/pacientes/cultivos/${paciente.id}?cama=${paciente.cama}`);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <Grid item xs={12} lg={6}>
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
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

  const ultimoPase = pases[0];

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        position: "relative",
        width: "100%",
        maxWidth: "100% !important",
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
              color: "primary.main",
              flexGrow: 1,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
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
      <Card sx={{ mb: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: 2 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
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
                  Cama {paciente.cama}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
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
                  {formatFecha(paciente.fechaIngreso)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <AssignmentIcon sx={{ color: "text.secondary", mb: 1 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  Total de Pases
                </Typography>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  color="primary.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {pases.length}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <ScienceIcon sx={{ color: "text.secondary", mb: 1 }} />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                >
                  Total de Cultivos
                </Typography>
                <Typography
                  variant={isMobile ? "h5" : "h4"}
                  color="primary.main"
                  sx={{ fontWeight: "bold" }}
                >
                  {cultivos.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {ultimoPase && (
            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                Último Pase Médico
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {formatFecha(ultimoPase.fechaCreacion)}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
              >
                {ultimoPase.principal || "Sin diagnóstico principal"}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Grid con cultivos y pases - Responsive */}
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              boxShadow: 2,
              height: "fit-content",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <ScienceIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                Cultivos ({cultivos.length})
              </Typography>
            </Box>
            <ListaCultivos
              cultivos={cultivos}
              expandedCultivo={expandedCultivo}
              onCultivoChange={handleCultivoChange}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              boxShadow: 2,
              height: "fit-content",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <AssignmentIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "primary.main",
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                Pases Médicos ({pases.length})
              </Typography>
            </Box>
            <ListaPases
              expandedPase={expandedPase}
              onPaseChange={handlePaseChange}
              pases={pases}
            />
          </Paper>
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
    </Container>
  );
};

export default DetallePaciente;
