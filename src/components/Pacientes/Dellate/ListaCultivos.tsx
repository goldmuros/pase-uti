import type { Cultivos } from "@/types/Cultivos";
import {
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Alert from "@mui/material/Alert";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";

interface ListaCultivosProps {
  cultivos: Cultivos[];
  expandedCultivo: string | false;
  onCultivoChange: (
    panel: string
  ) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const ListaCultivos: React.FC<ListaCultivosProps> = ({
  cultivos,
  expandedCultivo,
  onCultivoChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatearFecha = useCallback((fecha: string | null) => {
    if (!fecha) return "Pendiente";
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const getEstadoCultivo = (cultivo: Cultivos) => {
    return cultivo.fecha_recibido
      ? { color: "success" as const, label: "Recibido" }
      : { color: "warning" as const, label: "Pendiente" };
  };

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          gutterBottom
          sx={{
            color: "primary.main",
            mb: 3,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          <ScienceIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Cultivos
          <Badge badgeContent={cultivos.length} color="primary" sx={{ ml: 2 }}>
            <Box />
          </Badge>
        </Typography>

        {cultivos.length === 0 ? (
          <Alert severity="info" sx={{ textAlign: "center" }}>
            No hay cultivos registrados para este paciente
          </Alert>
        ) : (
          cultivos.map(cultivo => {
            const estado = getEstadoCultivo(cultivo);
            return (
              <Accordion
                key={cultivo.id}
                expanded={expandedCultivo === cultivo.id}
                onChange={onCultivoChange(cultivo.id)}
                sx={{
                  mb: 1,
                  "&:before": { display: "none" },
                  boxShadow: 1,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: "grey.50",
                    "&:hover": { backgroundColor: "grey.100" },
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 2, sm: 3 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      justifyContent: "space-between",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: { xs: 1, sm: 0 },
                    }}
                  >
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant={isMobile ? "body1" : "subtitle1"}
                        sx={{
                          fontWeight: "bold",
                          fontSize: { xs: "0.95rem", sm: "1rem" },
                        }}
                      >
                        {cultivo.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                      >
                        Solicitado: {formatearFecha(cultivo.fecha_solicitud)}
                      </Typography>
                    </Box>
                    <Chip
                      label={estado.label}
                      color={estado.color}
                      size={isMobile ? "small" : "small"}
                      sx={{
                        mt: { xs: 0.5, sm: 0 },
                        mr: { xs: 0, sm: 2 },
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid sx={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Fecha Recibido:</strong>{" "}
                          {formatearFecha(cultivo.fecha_recibido)}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Resultado:
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor:
                          estado.color === "success" ? "success.50" : "grey.50",
                        p: 2,
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor:
                          estado.color === "success"
                            ? "success.200"
                            : "grey.200",
                      }}
                    >
                      <Typography variant="body2">
                        {cultivo.resultado}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ListaCultivos;
