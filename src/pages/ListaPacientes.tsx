import {
  Bed as BedIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Chip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pacientes as pacientesIniciales } from "../mock/pacientes";

const ListaPacientesMejorada = () => {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState(pacientesIniciales);

  const irDetallePaciente = (pacienteId: string) => {
    navigate(`/pacientes/${pacienteId}`);
  };

  const agregarPase = (pacienteId: string, cama: string) => {
    navigate(`/pases/${pacienteId}?cama=${cama}`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
        >
          <HospitalIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Gestión de Pacientes
        </Typography>
      </Box>

      {/* Lista de pacientes */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fill, minmax(400px, 1fr))",
            md: "repeat(auto-fill, minmax(450px, 1fr))",
          },
          mb: 4,
        }}
      >
        {pacientes.map(paciente => (
          <Card
            key={paciente.id}
            elevation={2}
            sx={{
              cursor: "pointer",
              opacity: paciente.activo ? 1 : 0.7,
              border: paciente.activo
                ? "2px solid transparent"
                : "2px dashed #ccc",
              "&:hover": {
                boxShadow: 4,
                transform: "translateY(-2px)",
                transition: "all 0.2s ease-in-out",
              },
            }}
            onClick={() => irDetallePaciente(paciente.id)}
          >
            <CardHeader
              avatar={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PersonIcon
                    color={paciente.activo ? "primary" : "disabled"}
                  />
                </Box>
              }
              title={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    <BedIcon fontSize="small" />
                    Cama: {paciente.cama}
                  </Typography>
                  <Chip
                    size="small"
                    label={paciente.activo ? "Activo" : "Inactivo"}
                    color={paciente.activo ? "success" : "default"}
                    variant={paciente.activo ? "filled" : "outlined"}
                  />
                </Box>
              }
              subheader={
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    {paciente.nombre} {paciente.apellido}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ingreso: {paciente.fechaIngreso}
                  </Typography>
                </Box>
              }
            />
            <CardActions>
              <Button
                size="small"
                color="primary"
                onClick={event => {
                  event.stopPropagation();

                  agregarPase(paciente.id, paciente.cama);
                }}
              >
                Agregar pase
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ListaPacientesMejorada;
