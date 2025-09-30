import { useDeleteMedico, useUpdateMedico } from "@/hooks/useMedicos";
import { useRoles } from "@/hooks/useRoles";
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMedicoData } from "../hooks/useMedicosData";
import type { Medico } from "../types/Medico";

// Componente principal
const DetalleMedico: React.FC = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { medico, isLoading, error } = useMedicoData(id);
  const updateMedico = useUpdateMedico();
  const deleteMedico = useDeleteMedico();
  const { data: roles } = useRoles();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Omit<
    Medico,
    "id" | "created_at" | "updated_at"
  > | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (medico) {
      setEditData({
        nombre: medico.nombre,
        apellido: medico.apellido,
        rol_id: medico.rol_id,
        activo: medico.activo,
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleSaveEdit = async () => {
    if (medico && editData) {
      try {
        await updateMedico.mutateAsync({ id: medico.id, ...editData });
        setIsEditing(false);
        setEditData(null);
      } catch (error) {
        console.error("Error updating medico:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (medico) {
      try {
        await deleteMedico.mutateAsync(medico.id);
        navigate("/medicos");
      } catch (error) {
        console.error("Error deleting medico:", error);
      }
    }
  };

  const handleTextChange =
    (field: keyof Omit<Medico, "id" | "created_at" | "updated_at">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (editData) {
        const value = event.target.value;
        setEditData(prev => (prev ? { ...prev, [field]: value } : null));
      }
    };

  const handleSelectChange =
    (field: keyof Omit<Medico, "id" | "created_at" | "updated_at">) =>
    (event: SelectChangeEvent<unknown>) => {
      if (editData) {
        const value = event.target.value;
        setEditData(prev => (prev ? { ...prev, [field]: value } : null));
      }
    };

  const handleCheckboxChange =
    (field: keyof Omit<Medico, "id" | "created_at" | "updated_at">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (editData) {
        const value = event.target.checked;
        setEditData(prev => (prev ? { ...prev, [field]: value } : null));
      }
    };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          height={200}
          sx={{ mb: 3, borderRadius: 2 }}
        />
      </Container>
    );
  }

  if (error || !medico) {
    return (
      <Container
        maxWidth="xl"
        sx={{ px: { xs: 1, sm: 2, md: 3 }, textAlign: "center" }}
      >
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {error || "Médico no encontrado"}
          </Typography>
          <Typography variant="body2">
            El médico solicitado no existe o no se pudo cargar la información.
          </Typography>
        </Alert>
        <Button
          onClick={handleGoBack}
          color="primary"
          size="large"
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2 }}
        >
          Volver Atrás
        </Button>
      </Container>
    );
  }

  const rol = roles?.find(r => r.id === medico.rol_id);

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        position: "relative",
        width: "100%",
        maxWidth: "100% !important",
        overflowY: "auto",
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
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Tooltip title="Volver atrás">
            <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              flexGrow: 1,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
            }}
          >
            <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {medico.nombre} {medico.apellido}
          </Typography>
        </Box>
        {!isEditing && (
          <>
            <Tooltip title="Editar médico">
              <IconButton onClick={handleEdit} color="primary">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar médico">
              <IconButton
                onClick={() => setDeleteDialogOpen(true)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>

      {/* Información del médico - Responsive */}
      <Card sx={{ mb: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: 2 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {isEditing ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                <TextField
                  fullWidth
                  label="Nombre"
                  value={editData?.nombre || ""}
                  onChange={handleTextChange("nombre")}
                  sx={{ flex: 1, minWidth: 250 }}
                />
                <TextField
                  fullWidth
                  label="Apellido"
                  value={editData?.apellido || ""}
                  onChange={handleTextChange("apellido")}
                  sx={{ flex: 1, minWidth: 250 }}
                />
              </Box>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={editData?.rol_id || ""}
                  label="Rol"
                  onChange={handleSelectChange("rol_id")}
                >
                  {roles?.map(r => (
                    <MenuItem key={r.id} value={r.id}>
                      {r.tipo_rol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editData?.activo || false}
                    onChange={handleCheckboxChange("activo")}
                  />
                }
                label="Médico Activo"
              />
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveEdit}
                >
                  Guardar Cambios
                </Button>
                <Button variant="outlined" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    backgroundColor: "primary.main",
                    color: "white",
                    borderRadius: 2,
                    flex: 1,
                    minWidth: 200,
                  }}
                >
                  <HospitalIcon sx={{ fontSize: { xs: 28, sm: 32 }, mb: 1 }} />
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    sx={{ fontWeight: "bold" }}
                  >
                    {rol?.tipo_rol || "Rol no encontrado"}
                  </Typography>
                </Paper>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="h6" gutterBottom>
                    Estado
                  </Typography>
                  <Typography
                    variant="body1"
                    color={medico.activo ? "success.main" : "text.secondary"}
                  >
                    {medico.activo ? "Activo" : "Inactivo"}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Información de Registro
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Creado: {formatFecha(medico.created_at)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Última actualización: {formatFecha(medico.updated_at)}
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            ¿Estás seguro de que quieres eliminar al médico {medico?.nombre}{" "}
            {medico?.apellido}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMedico.isPending}
          >
            {deleteMedico.isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DetalleMedico;
