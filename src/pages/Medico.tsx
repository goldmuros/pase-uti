import {
  useCreateMedico,
  useDeleteMedico,
  useUpdateMedico,
} from "@/hooks/useMedicos";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControlLabel,
  IconButton,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMedicoData } from "../hooks/useMedicosData";
import type { Medico } from "../types/Medico";

// Componente principal
const Medico: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const isCreating = !id;
  const {
    medico,
    isLoading: loadingMedico,
    error: loadError,
  } = useMedicoData(id || "");
  const createMedico = useCreateMedico();
  const updateMedico = useUpdateMedico();
  const deleteMedico = useDeleteMedico();

  const [formData, setFormData] = useState<
    Omit<Medico, "id" | "created_at" | "updated_at">
  >({
    nombre: "",
    apellido: "",
    activo: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(isCreating);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Cargar datos cuando estamos editando en modo lectura
  useEffect(() => {
    if (medico && !isCreating) {
      setFormData({
        nombre: medico.nombre,
        apellido: medico.apellido,
        activo: medico.activo,
      });
    }
  }, [medico, isCreating]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const agregarNuevoMedico = () => {
    navigate("/medicos/nuevo");
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTextChange =
    (field: keyof Omit<Medico, "id" | "created_at" | "updated_at">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
      }
    };

  const handleCheckboxChange =
    (field: keyof Omit<Medico, "id" | "created_at" | "updated_at">) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.checked;
      setFormData(prev => ({ ...prev, [field]: value }));
    };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (isCreating) {
      navigate(-1);
    } else {
      setIsEditing(false);
      setFormData({
        nombre: medico?.nombre || "",
        apellido: medico?.apellido || "",
        activo: medico?.activo || true,
      });
      setErrors({});
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      if (isCreating) {
        await createMedico.mutateAsync(formData);
        navigate("/medicos");
      } else if (medico) {
        await updateMedico.mutateAsync({ id: medico.id, ...formData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving medico:", error);
    } finally {
      setIsSaving(false);
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

  // Estados de carga y error
  if (!isCreating && loadingMedico) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Skeleton
          variant="rectangular"
          height={300}
          sx={{ mb: 3, borderRadius: 2 }}
        />
      </Container>
    );
  }

  if (!isCreating && (loadError || !medico)) {
    return (
      <Container
        maxWidth="xl"
        sx={{ px: { xs: 1, sm: 2, md: 3 }, textAlign: "center" }}
      >
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            <WarningIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            {loadError || "Médico no encontrado"}
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

  return (
    <Container
      sx={{
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
        position: "relative",
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
            {isCreating
              ? "Nuevo Médico"
              : isEditing
                ? "Editar Médico"
                : `${medico?.nombre} ${medico?.apellido}`}
          </Typography>
        </Box>
      </Box>

      {/* Card del formulario o información - Responsive */}
      <Card
        sx={{
          display: "fit-content",
          width: "auto",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {isEditing || isCreating ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Campos de texto */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                }}
              >
                <TextField
                  fullWidth
                  label="Nombre"
                  placeholder="Ingrese el nombre del médico"
                  value={formData.nombre}
                  onChange={handleTextChange("nombre")}
                  error={!!errors.nombre}
                  helperText={errors.nombre}
                  variant="outlined"
                  disabled={isSaving}
                  sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                />
                <TextField
                  fullWidth
                  label="Apellido"
                  placeholder="Ingrese el apellido del médico"
                  value={formData.apellido}
                  onChange={handleTextChange("apellido")}
                  error={!!errors.apellido}
                  helperText={errors.apellido}
                  variant="outlined"
                  disabled={isSaving}
                  sx={{ flex: 1, minWidth: { xs: "100%", sm: 250 } }}
                />
              </Box>

              {/* Checkbox de estado */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.activo}
                    onChange={handleCheckboxChange("activo")}
                    disabled={isSaving}
                  />
                }
                label="Médico Activo"
                sx={{
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              />

              {/* Botones de acción */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={isSaving}
                  sx={{ borderRadius: 2, flex: { xs: 1, sm: "auto" } }}
                >
                  {isSaving ? "Guardando..." : "Guardar Médico"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  sx={{ borderRadius: 2, flex: { xs: 1, sm: "auto" } }}
                >
                  Cancelar
                </Button>
              </Box>

              {/* Mensajes de error si existen */}
              {(createMedico.isError || updateMedico.isError) && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  <Typography variant="body2">
                    {createMedico.isError
                      ? "Error al crear el médico"
                      : "Error al actualizar el médico"}
                  </Typography>
                </Alert>
              )}
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
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="h6" gutterBottom>
                    Estado
                  </Typography>
                  <Typography
                    variant="body1"
                    color={medico?.activo ? "success.main" : "text.secondary"}
                  >
                    {medico?.activo ? "Activo" : "Inactivo"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </CardContent>
        {!isEditing && (
          <CardActions
            sx={{
              justifyContent: "space-between",
              px: 2,
              pb: 2,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Button
              size="small"
              color="primary"
              startIcon={<EditIcon />}
              onClick={event => {
                event.stopPropagation();
                handleEdit();
              }}
              sx={{
                borderRadius: 2,
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Editar Médico
            </Button>
            <Button
              size="small"
              color="primary"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={event => {
                event.stopPropagation();
                setDeleteDialogOpen(true);
              }}
              sx={{
                borderRadius: 2,
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              Borrar Médico
            </Button>
          </CardActions>
        )}
      </Card>

      {/* Botón flotante para agregar médico - Responsive */}
      <Tooltip title="Agregar nuevo médico">
        <Fab
          color="primary"
          aria-label="add"
          onClick={agregarNuevoMedico}
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

export default Medico;
