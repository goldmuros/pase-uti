import { formatFecha } from "@/utils/fechas";
import {
  Add as AddIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
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
import { useMedicosData } from "../hooks/useMedicosData";

// Componente principal
const ListaMedicos: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { medicos, isLoading, error } = useMedicosData();
  const [tabValue, setTabValue] = useState(0);

  const irDetalleMedico = (medicoId: string) => {
    navigate(`/medicos/${medicoId}`);
  };

  const agregarNuevoMedico = () => {
    navigate("/medicos/nuevo");
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
            No se pudieron cargar los médicos.
          </Typography>
        </Alert>
      </Container>
    );
  }

  const medicosActivos = medicos.filter(m => m.activo);
  const medicosInactivos = medicos.filter(m => !m.activo);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
          position: "relative",
          width: "100%",
          maxWidth: "100% !important",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
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
            flexShrink: 0,
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
            Gestión de Médicos
          </Typography>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(_event, newValue) => setTabValue(newValue)}
          sx={{ mb: { xs: 2, sm: 3 }, flexShrink: 0 }}
        >
          <Tab label={`Médicos Activos (${medicosActivos.length})`} />
          <Tab label={`Médicos Inactivos (${medicosInactivos.length})`} />
        </Tabs>

        {/* Contenedor con scroll */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            pb: 10, // Espacio para el botón flotante
          }}
        >
          {/* Tab 0: Médicos activos */}
          {tabValue === 0 && medicosActivos.length > 0 && (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {medicosActivos.map(medico => (
                <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={medico.id}>
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
                    onClick={() => irDetalleMedico(medico.id)}
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
                            bgcolor: "primary.main",
                            color: "white",
                          }}
                        >
                          <PersonIcon />
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
                            {medico.nombre} {medico.apellido}
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
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            Registrado: {formatFecha(medico.created_at)}
                          </Typography>
                        </Box>
                      }
                      sx={{ flexGrow: 1, pb: 1 }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Tab 1: Médicos inactivos */}
          {tabValue === 1 && medicosInactivos.length > 0 && (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {medicosInactivos.map(medico => (
                <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={medico.id}>
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
                    onClick={() => irDetalleMedico(medico.id)}
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
                            {medico.nombre} {medico.apellido}
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
                            Registrado: {formatFecha(medico.created_at)}
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

        {/* Botón flotante para agregar médico - Responsive */}
        <Tooltip title="Agregar nuevo médico">
          <Fab
            color="primary"
            aria-label="add"
            onClick={agregarNuevoMedico}
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

export default ListaMedicos;
