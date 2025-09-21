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
import React, { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePacienteData } from "../hooks/usePacienteData";
import { mockCamas } from "../mock/camas";

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
                  {paciente.cama_id
                    ? (() => {
                        const cama = mockCamas.find(
                          c => c.id === paciente.cama_id
                        );
                        return cama
                          ? `Cama ${cama.numero} (${cama.sala})`
                          : "Cama no asignada";
                      })()
                    : "Cama no asignada"}
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

            <Grid sx={{ xs: 6, md: 3 }}>
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

            <Grid sx={{ xs: 6, md: 3 }}>
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
                {formatFecha(ultimoPase.fecha_creacion)}
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
        <Grid sx={{ xs: 12, lg: 6 }}>
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

        <Grid sx={{ xs: 12, lg: 6 }}>
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
