import type { PasesPorPaciente } from "@/pages/ListaPases";
import {
  Bed as BedIcon,
  CalendarToday as CalendarIcon,
  ExpandMore as ExpandMoreIcon,
  History as HistoryIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

const CardPase = ({
  pasePaciente,
}: {
  pasePaciente: PasesPorPaciente;
}): ReactNode => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(
    false
  );

  const formatFechaCorta = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAccordionChange = useCallback(
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedAccordion(isExpanded ? panel : false);
    },
    []
  );

  const handleVerDetallePaciente = (pacienteId: string) => {
    navigate(`/pacientes/${pacienteId}`);
  };

  const handleVerDetallePase = (paseId: string) => {
    navigate(`/pases/${paseId}`);
  };

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 2, maxWidth: 500 }}>
      {/* Header del paciente */}
      <CardHeader
        avatar={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonIcon color="primary" />
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
              {pasePaciente.paciente.nombre} {pasePaciente.paciente.apellido}
            </Typography>
            <Chip
              size="small"
              label={`${pasePaciente.pases.length} pase${
                pasePaciente.pases.length !== 1 ? "s" : ""
              }`}
              color="primary"
              variant="outlined"
            />
          </Box>
        }
        subheader={
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              mt: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BedIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Cama: {pasePaciente.paciente.cama_id || "No asignada"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
              >
                Último pase:{" "}
                {formatFechaCorta(pasePaciente.ultimoPase.fecha_creacion)}
              </Typography>
            </Box>
          </Box>
        }
        action={
          <Tooltip title="Ver detalle del paciente">
            <IconButton
              onClick={() => handleVerDetallePaciente(pasePaciente.paciente.id)}
              color="primary"
            >
              <PersonIcon />
            </IconButton>
          </Tooltip>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0 }}>
        {/* Último pase destacado */}
        <Paper
          sx={{
            p: 3,
            mb: 2,
            backgroundColor: "primary.main",
            color: "white",
            borderRadius: 2,
            cursor: "pointer",
            "&:hover": {
              opacity: 0.9,
            },
          }}
          onClick={() => handleVerDetallePase(pasePaciente.ultimoPase.id)}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            Último Pase - {formatFecha(pasePaciente.ultimoPase.fecha_creacion)}
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "medium" }}
          >
            {pasePaciente.ultimoPase.principal || "Sin diagnóstico principal"}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
            {pasePaciente.ultimoPase.actualmente ||
              "Sin información del estado actual"}
          </Typography>

          {pasePaciente.ultimoPase.pendientes && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "medium", mb: 1 }}>
                Pendientes:
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {pasePaciente.ultimoPase.pendientes}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              pt: 2,
              borderTop: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            {pasePaciente.ultimoPase.gcs_rass && (
              <Chip
                label={`GCS/RASS: ${pasePaciente.ultimoPase.gcs_rass}`}
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                }}
              />
            )}
            {pasePaciente.ultimoPase.atb && (
              <Chip
                label={`ATB: ${pasePaciente.ultimoPase.atb}`}
                size="small"
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                }}
              />
            )}
          </Box>
        </Paper>

        {/* Acordeón con pases anteriores */}
        {pasePaciente.pasesAnteriores.length > 0 && (
          <Accordion
            expanded={
              expandedAccordion === `paciente-${pasePaciente.paciente.id}`
            }
            onChange={handleAccordionChange(
              `paciente-${pasePaciente.paciente.id}`
            )}
            sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: "grey.100",
                "&:hover": { backgroundColor: "grey.200" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <HistoryIcon sx={{ mr: 1, color: "text.secondary" }} />
                <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                  Pases Anteriores ({pasePaciente.pasesAnteriores.length})
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              {pasePaciente.pasesAnteriores.map((pase, index) => (
                <Box key={pase.id}>
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {pase.principal || "Sin diagnóstico principal"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatFecha(pase.fecha_creacion)}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid sx={{ xs: 12, md: 6 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          Estado Actual:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pase.actualmente || "No especificado"}
                        </Typography>
                      </Grid>

                      <Grid sx={{ xs: 12, md: 6 }}>
                        <Typography
                          variant="subtitle2"
                          gutterBottom
                          sx={{ fontWeight: "bold" }}
                        >
                          Pendientes:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {pase.pendientes || "No hay pendientes"}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                      {pase.gcs_rass && (
                        <Chip
                          label={`GCS/RASS: ${pase.gcs_rass}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {pase.atb && (
                        <Chip
                          label={`ATB: ${pase.atb}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {pase.vc_cook && (
                        <Chip
                          label={`VC Cook: ${pase.vc_cook}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                  {index < pasePaciente.pasesAnteriores.length - 1 && (
                    <Divider />
                  )}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default CardPase;
