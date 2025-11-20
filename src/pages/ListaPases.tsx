import CardPase from "@/components/Pases/CardPase";
import { usePacientes } from "@/hooks/usePacientes";
import { usePases } from "@/hooks/usePases";
import { exportPasesToPDF } from "@/utils/exportPasesToPDF";
import { formatDateTimeLocal } from "@/utils/fechas";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Fab,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Componente principal
const ListaPases: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pacienteId = new URLSearchParams(window.location.search).get(
    "pacienteId"
  );

  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(new Date());

  const { data: pacientes } = usePacientes({ todosPacientes: false });
  const { data: pases } = usePases(fechaFiltro || new Date());

  const pacienteFiltrado = pacienteId
    ? pacientes?.find(p => p.id === pacienteId)
    : null;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDescargarPDF = () => {
    if (pases && pases.length > 0 && fechaFiltro && pacientes) {
      exportPasesToPDF({
        pases,
        pacientes,
        fecha: formatDateTimeLocal(fechaFiltro.toString()),
      });
    }
  };

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
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
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
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            <AssignmentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {pacienteId && pacienteFiltrado
              ? `Pases Médicos de ${pacienteFiltrado.nombre} ${pacienteFiltrado.apellido}`
              : "Pases Médicos por Paciente"}
          </Typography>
        </Box>

        {/* Botón para descargar PDF */}
        {pases && pases.length > 0 && (
          <Tooltip title="Descargar PDF">
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDescargarPDF}
              sx={{ borderRadius: 2, mt: { xs: 2, sm: 0 } }}
              size={isMobile ? "small" : "medium"}
            >
              Descargar PDF
            </Button>
          </Tooltip>
        )}
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
      </Box>

      {pases?.length === 0 ? (
        <Paper sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <AssignmentIcon
            sx={{
              fontSize: { xs: 48, sm: 64 },
              color: "text.secondary",
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {fechaFiltro
              ? "No hay pases registrados para esta fecha"
              : "No hay pases registrados"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {fechaFiltro
              ? "Intente con otra fecha o limpie el filtro."
              : "Comience agregando un nuevo pase al sistema."}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/pases/nuevo")}
            sx={{ borderRadius: 2 }}
            size={isMobile ? "medium" : "large"}
          >
            Agregar Pase
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {pases?.map(pase => (
            <Grid sx={{ xs: 12, sm: 6, lg: 4 }} key={pase.id}>
              <CardPase pase={pase} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Botón flotante para agregar pase - Responsive */}
      {pases && pases.length > 0 && (
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
