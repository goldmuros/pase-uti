import { mockCamas } from "@/mock/camas";
import type { Paciente } from "@/types/Paciente";
import type { Pase } from "@/types/Pase";
import {
  Bed as BedIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as HospitalIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const InformacionPaciente: React.FC<{
  paciente: Paciente;
  ultimoPase?: Pase;
}> = ({ paciente, ultimoPase }) => {
  const calcularDiasIngreso = (fechaIngreso: string) => {
    const fecha = new Date(fechaIngreso);
    const hoy = new Date();
    const diferencia = hoy.getTime() - fecha.getTime();
    return Math.floor(diferencia / (1000 * 3600 * 24));
  };

  const diasIngreso = calcularDiasIngreso(paciente.fecha_ingreso);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ color: "primary.main", mb: 2 }}
        >
          <HospitalIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Información del Paciente
        </Typography>

        <Grid container spacing={3}>
          <Grid sx={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <BedIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
                Cama:
              </Typography>
              <Chip
                label={
                  paciente.cama_id
                    ? (() => {
                        const cama = mockCamas.find(
                          c => c.id === paciente.cama_id
                        );
                        return cama
                          ? `Cama ${cama.numero} (${cama.sala})`
                          : "Cama no asignada";
                      })()
                    : "Cama no asignada"
                }
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
                Fecha de Ingreso:
              </Typography>
              <Typography variant="body1">
                {new Date(paciente.fecha_ingreso).toLocaleDateString("es-ES")}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <ScheduleIcon sx={{ mr: 1, color: "secondary.main" }} />
              <Typography variant="body1" sx={{ fontWeight: "bold", mr: 1 }}>
                Días de ingreso:
              </Typography>
              <Chip
                label={`${diasIngreso} días`}
                color={diasIngreso > 30 ? "warning" : "success"}
                size="small"
              />
            </Box>
          </Grid>

          <Grid sx={{ xs: 12, md: 6 }}>
            {paciente.motivo_ingreso && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                  Motivo de Ingreso:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    backgroundColor: "grey.50",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  {paciente.motivo_ingreso}
                </Typography>
              </Box>
            )}

            {ultimoPase && (
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
                  Diagnóstico Principal:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    backgroundColor: "primary.50",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "primary.200",
                  }}
                >
                  {ultimoPase.principal}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InformacionPaciente;
