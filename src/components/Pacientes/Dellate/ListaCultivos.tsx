import type { Cultivos } from "@/types/Cultivos";
import {
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";
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
  const formatearFecha = useCallback((fecha: Date) => {
    return fecha.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const getEstadoCultivo = (cultivo: Cultivos) => {
    return cultivo.fechaRecibido
      ? { color: "success" as const, label: "Recibido" }
      : { color: "warning" as const, label: "Pendiente" };
  };

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "primary.main", mb: 3 }}
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
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {cultivo.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Solicitado: {formatearFecha(cultivo.fechaSolicitud)}
                      </Typography>
                    </Box>
                    <Chip
                      label={estado.label}
                      color={estado.color}
                      size="small"
                      sx={{ mr: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid sx={{ xs: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Fecha Recibido:</strong>{" "}
                          {formatearFecha(cultivo.fechaRecibido)}
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
