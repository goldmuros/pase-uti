import ListaCultivos from "@/components/Pacientes/Dellate/ListaCultivos";
import ListaPases from "@/components/Pacientes/Dellate/ListaPases";
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Grid,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InformacionPaciente from "../components/Pacientes/Dellate/InformacionPaciente";
import { cultivos } from "../mock/cultivos";
import { pacientes } from "../mock/pacientes";
import { pases } from "../mock/pases";
import type { Cultivos } from "../types/Cultivos";
import type { Paciente } from "../types/Paciente";
import type { Pase } from "../types/Pase";

// Tipos para el estado del componente
interface DetallePacienteState {
  paciente: Paciente | null;
  pases: Pase[];
  cultivos: Cultivos[];
  isLoading: boolean;
  error: string | null;
}

// Hook personalizado para obtener datos del paciente
const usePacienteData = (id: string) => {
  const [state, setState] = useState<DetallePacienteState>({
    paciente: null,
    pases: [],
    cultivos: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300));

        const paciente = pacientes.find(p => p.id === id);

        if (!paciente) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Paciente no encontrado",
          }));
          return;
        }

        const pasesPaciente = pases
          .filter(pase => pase.pacienteId === id)
          .sort(
            (a, b) =>
              new Date(b.fechaCreacion).getTime() -
              new Date(a.fechaCreacion).getTime()
          );

        const cultivosPaciente = cultivos
          .filter(cultivo => cultivo.pacienteId === id)
          .sort(
            (a, b) =>
              new Date(b.fechaRecibido).getTime() -
              new Date(a.fechaRecibido).getTime()
          );

        setState({
          paciente,
          pases: pasesPaciente,
          cultivos: cultivosPaciente,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Error al cargar los datos del paciente",
        }));
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return state;
};

// Componente principal
const DetallePaciente: React.FC = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
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

  // Estados de carga y error
  if (isLoading) {
    return (
      <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid sx={{ xs: 12, lg: 6 }}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
          <Grid sx={{ xs: 12, lg: 6 }}>
            <Skeleton variant="rectangular" height={300} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (error || !paciente) {
    return (
      <Box sx={{ p: 3, textAlign: "center", maxWidth: 1400, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {error || "Paciente no encontrado"}
          </Typography>
          <Typography variant="body2">
            El paciente solicitado no existe o no se pudo cargar la información.
          </Typography>
        </Alert>
        <IconButton onClick={handleGoBack} color="primary" size="large">
          <ArrowBackIcon />
        </IconButton>
      </Box>
    );
  }

  const ultimoPase = pases[0];

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      {/* Header con botón de regreso */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Tooltip title="Volver atrás">
          <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "primary.main", flexGrow: 1 }}
        >
          <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          {`${paciente.nombre} ${paciente.apellido}`}
        </Typography>
      </Box>

      {/* Información básica del paciente */}
      <InformacionPaciente paciente={paciente} ultimoPase={ultimoPase} />

      {/* Grid con cultivos y pases */}
      <Grid container spacing={3}>
        <Grid sx={{ xs: 12, lg: 6 }}>
          <ListaCultivos
            cultivos={cultivos}
            expandedCultivo={expandedCultivo}
            onCultivoChange={handleCultivoChange}
          />
        </Grid>

        <Grid sx={{ xs: 12, lg: 6 }}>
          <ListaPases
            expandedPase={expandedPase}
            onPaseChange={handlePaseChange}
            pases={pases}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DetallePaciente;
