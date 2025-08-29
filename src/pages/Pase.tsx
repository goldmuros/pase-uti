import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

const defaultData = {
  id: "",
  antecedentes: "",
  gcs_rass: "",
  atb: "",
  vc_cook: "",
  actualmente: "",
  pendientes: "",
  pacienteId: "",
  principal: "",
  antibioticos: "",
  fechaCreacion: "",
  cultivos: "",
};

const Pase = () => {
  const [formData, setFormData] = useState(defaultData);

  const [submitMessage, setSubmitMessage] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const paciente = {
    id: urlParams.get("pacienteId") || "",
    cama: urlParams.get("cama") || "",
  };

  // Función para generar fecha actual en formato YYYY-MM-DD HH:mm:ss
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Función para generar un ID único
  const generateId = () => {
    return "pase_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  };

  // Inicializar formulario
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      id: generateId(),
      pacienteId: paciente.id,
      fechaCreacion: getCurrentDateTime(),
    }));
  }, []);

  // Manejar cambios en los campos
  const handleChange = event => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = event => {
    event.preventDefault();

    // Validar campos requeridos
    if (!formData.pacienteId) {
      setSubmitMessage("Error: pacienteId es requerido");
      return;
    }

    // Aquí puedes agregar la lógica para enviar los datos a tu API
    console.log("Datos del formulario:", formData);
    setSubmitMessage("Pase creado exitosamente");

    // Opcional: resetear formulario después del envío
    // resetForm();
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      ...defaultData,
      id: generateId(),
      pacienteId: paciente.id,
      fechaCreacion: getCurrentDateTime(),
    });
    setSubmitMessage("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f7fa",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 3, flex: 1 }}>
        <Paper
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Pase Médico
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Cama: {paciente.cama}
            </Typography>
          </Box>

          {/* Alert */}
          {submitMessage && (
            <Box sx={{ p: 2 }}>
              <Alert
                severity={submitMessage.includes("Error") ? "error" : "success"}
                sx={{ borderRadius: 2 }}
              >
                {submitMessage}
              </Alert>
            </Box>
          )}

          {/* Form Content */}
          <Box sx={{ p: 4, pb: 10 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={4}>
                {/* Campos principales - Una fila cada uno */}
                <Grid sx={{ xs: 12 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "#2c3e50", fontWeight: 500 }}
                  >
                    Información Principal
                  </Typography>
                  <TextField
                    fullWidth
                    label="Diagnóstico Principal"
                    name="principal"
                    value={formData.principal}
                    onChange={handleChange}
                    variant="outlined"
                    required
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Antecedentes"
                    name="antecedentes"
                    value={formData.antecedentes}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Estado Actual"
                    name="actualmente"
                    value={formData.actualmente}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Pendientes"
                    name="pendientes"
                    value={formData.pendientes}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12 }}>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="h6"
                    sx={{ mb: 3, color: "#2c3e50", fontWeight: 500 }}
                  >
                    Información Adicional
                  </Typography>
                </Grid>

                {/* Campos adicionales */}
                <Grid sx={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="ID Paciente"
                    name="pacienteId"
                    value={formData.pacienteId}
                    variant="outlined"
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Fecha de Creación"
                    name="fechaCreacion"
                    value={formData.fechaCreacion}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="GCS RASS"
                    name="gcs_rass"
                    value={formData.gcs_rass}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="ATB"
                    name="atb"
                    value={formData.atb}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="VC Cook"
                    name="vc_cook"
                    value={formData.vc_cook}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Antibióticos"
                    name="antibioticos"
                    value={formData.antibioticos}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid sx={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Cultivos"
                    name="cultivos"
                    value={formData.cultivos}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Footer fijo con botones */}
      <Paper
        elevation={8}
        sx={{
          position: "sticky",
          bottom: 0,
          zIndex: 1000,
          borderRadius: "16px 16px 0 0",
          background: "white",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            p: 3,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 15px 0 rgba(102, 126, 234, 0.4)",
              "&:hover": {
                background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                boxShadow: "0 6px 20px 0 rgba(102, 126, 234, 0.6)",
              },
            }}
          >
            Crear Pase
          </Button>
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={resetForm}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderColor: "#667eea",
              color: "#667eea",
              "&:hover": {
                borderColor: "#5a6fd8",
                backgroundColor: "rgba(102, 126, 234, 0.04)",
              },
            }}
          >
            Limpiar Formulario
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Pase;
