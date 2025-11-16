import type { Paciente } from "@/types/Paciente";
import type { PaseType } from "@/types/Pase";
import { Bed as BedIcon } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface PasePaciente extends PaseType {
  pacientes: Paciente;
}
const CardPase = ({ pase }: { pase: PasePaciente }): ReactNode => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
              {pase.pacientes.nombre} {pase.pacientes.apellido}
            </Typography>
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
                Cama: {pase.pacientes.cama_id || "No asignada"}
              </Typography>
            </Box>
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0 }}>
        <Accordion>
          <AccordionDetails>
            <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
              Principal
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "medium" }}
            >
              {pase.principal || "Sin diagnóstico principal"}
            </Typography>

            <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
              Pendientes
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {pase.pendientes}
            </Typography>

            <Box
              sx={{ display: "flex", gap: 1, flexDirection: "column", mt: 1 }}
            >
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
          </AccordionDetails>
        </Accordion>
      </CardContent>
      <CardActions>
        <Box sx={{ display: "flex", alignContent: "space-between" }}>
          <Button onClick={() => handleVerDetallePase(pase.id)} size="small">
            Ver Pase
          </Button>
          <Button
            onClick={() => handleVerDetallePaciente(pase.pacientes.id)}
            color="primary"
            variant="contained"
          >
            Ver pacientes
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default CardPase;
