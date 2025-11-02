import CardPase from "@/components/Pases/CardPase";
import { usePacientes } from "@/hooks/usePacientes";
import { usePases } from "@/hooks/usePases";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
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
import React from "react";
import { useNavigate } from "react-router-dom";
import type { Paciente } from "../types/Paciente";
import type { PaseType } from "../types/Pase";

// Interface para pases agrupados por paciente
export interface PasesPorPaciente {
  paciente: Paciente;
  pases: PaseType[];
  ultimoPase: PaseType;
  pasesAnteriores: PaseType[];
}

// Hook personalizado para obtener pases agrupados por paciente
const usePasesAgrupadosData = (pacientes: Paciente[] | undefined) => {
  const {
    data: pases,
    isLoading: isLoadingPases,
    error: errorPases,
  } = usePases();

  const isLoading = isLoadingPases;
  const error = errorPases;

  if (isLoading || error || !pases || !pacientes) {
    return {
      pasesPorPaciente: [],
      isLoading,
      error: error ? `Error al cargar los datos: ${error.message}` : null,
    };
  }

  // Agrupar pases por paciente
  const pasesAgrupados: { [pacienteId: string]: PaseType[] } = {};

  pases.forEach((pase: PaseType) => {
    if (!pasesAgrupados[pase.paciente_id]) {
      pasesAgrupados[pase.paciente_id] = [];
    }
    pasesAgrupados[pase.paciente_id].push(pase);
  });

  // Crear estructura final con información del paciente
  const pasesPorPaciente: PasesPorPaciente[] = Object.entries(pasesAgrupados)
    .map(([pacienteId, pasesList]) => {
      const paciente = pacientes.find(p => p.id === pacienteId);
      if (!paciente) return null;

      // Ordenar pases por fecha descendente
      const pasesOrdenados = pasesList.sort(
        (a, b) =>
          new Date(b.fecha_creacion).getTime() -
          new Date(a.fecha_creacion).getTime()
      );

      return {
        paciente,
        pases: pasesOrdenados,
        ultimoPase: pasesOrdenados[0],
        pasesAnteriores: pasesOrdenados.slice(1),
      };
    })
    .filter(Boolean) as PasesPorPaciente[];

  // Ordenar por fecha del último pase (más reciente primero)
  const pasesPorPacienteOrdenados = pasesPorPaciente.sort(
    (a, b) =>
      new Date(b.ultimoPase.fecha_creacion).getTime() -
      new Date(a.ultimoPase.fecha_creacion).getTime()
  );

  return {
    pasesPorPaciente: pasesPorPacienteOrdenados,
    isLoading: false,
    error: null,
  };
};

// Componente principal
const ListaPases: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pacienteId = new URLSearchParams(window.location.search).get(
    "pacienteId"
  );

  const { data: pacientes } = usePacientes({ todosPacientes: false });
  const { pasesPorPaciente, isLoading, error } =
    usePasesAgrupadosData(pacientes);

  // Filtrar por paciente si se proporciona pacienteId
  const pasesFiltrados = pacienteId
    ? pasesPorPaciente.filter(item => item.paciente.id === pacienteId)
    : pasesPorPaciente;

  const pacienteFiltrado = pacienteId
    ? pacientes?.find(p => p.id === pacienteId)
    : null;

  const handleGoBack = () => {
    navigate(-1);
  };

  // Estados de carga
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 0.5, sm: 1, md: 2, lg: 3 } }}>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {Array.from({ length: 3 }, (_, index) => (
            <Grid sx={{ xs: 12 }} key={index}>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ mb: 2, borderRadius: 2 }}
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
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {error}
          </Typography>
          <Typography variant="body2">
            No se pudieron cargar los pases médicos.
          </Typography>
        </Alert>
        <IconButton onClick={handleGoBack} color="primary" size="large">
          <ArrowBackIcon />
        </IconButton>
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
        height: "100vh",
      }}
    >
      {/* Header con botón de regreso - Responsive */}
      <Box
        sx={{
          mb: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <Tooltip title="Volver atrás">
          <IconButton
            onClick={handleGoBack}
            sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
          >
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
          {pacienteId && pacienteFiltrado
            ? `Pases Médicos de ${pacienteFiltrado.nombre} ${pacienteFiltrado.apellido}`
            : "Pases Médicos por Paciente"}
        </Typography>
      </Box>

      {pasesFiltrados.length === 0 ? (
        <Paper
          sx={{ p: { xs: 3, sm: 4 }, textAlign: "center", borderRadius: 2 }}
        >
          <AssignmentIcon
            sx={{
              fontSize: { xs: 48, sm: 64 },
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay pases médicos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No se encontraron pases médicos en el sistema.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {pasesFiltrados.map(item => (
            <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={item.paciente.id}>
              <CardPase pasePaciente={item} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Botón flotante para agregar pase - Responsive */}
      {pasesFiltrados.length > 0 && (
        <Tooltip title="Agregar nuevo pase">
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => navigate("/pases/nuevo")}
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
      )}
    </Container>
  );
};

export default ListaPases;
