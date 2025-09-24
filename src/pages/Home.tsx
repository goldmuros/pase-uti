import {
  Assignment as AssignmentIcon,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const features = [
    {
      icon: (
        <PersonIcon
          sx={{ fontSize: { xs: 40, sm: 48 }, color: "primary.main" }}
        />
      ),
      title: "Gestión de Pacientes",
      description:
        "Administra la información de pacientes, historiales médicos y seguimientos.",
      path: "/pacientes",
    },
    {
      icon: (
        <AssignmentIcon
          sx={{ fontSize: { xs: 40, sm: 48 }, color: "primary.main" }}
        />
      ),
      title: "Pases Médicos",
      description:
        "Crea y gestiona pases médicos con diagnósticos y tratamientos detallados.",
      path: "/pases",
    },
    {
      icon: (
        <ScienceIcon
          sx={{ fontSize: { xs: 40, sm: 48 }, color: "primary.main" }}
        />
      ),
      title: "Cultivos y Laboratorios",
      description:
        "Registra y monitorea resultados de cultivos y estudios de laboratorio.",
      path: "/cultivos",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
        width: "100%",
        maxWidth: "100% !important",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: { xs: 4, sm: 6, md: 8 },
          py: { xs: 3, sm: 4 },
        }}
      >
        <HospitalIcon
          sx={{
            fontSize: { xs: 48, sm: 64, md: 80 },
            color: "primary.main",
            mb: 2,
          }}
        />
        <Typography
          variant={isMobile ? "h4" : "h3"}
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
            fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
          }}
        >
          Sistema Médico
        </Typography>
        <Typography
          variant={isMobile ? "body1" : "h6"}
          sx={{
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
            fontSize: { xs: "0.95rem", sm: "1.1rem" },
            lineHeight: 1.6,
          }}
        >
          Bienvenido al sistema de gestión médica. Utiliza el menú lateral para
          acceder a las diferentes funcionalidades del sistema.
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 3, sm: 4, md: 5 }}>
        {features.map((feature, index) => (
          <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              elevation={2}
              onClick={() => handleCardClick(feature.path)}
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 3, sm: 4 },
                  textAlign: "center",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: "primary.main",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                    flexGrow: 1,
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer Info */}
      <Paper
        elevation={1}
        sx={{
          mt: { xs: 4, sm: 6 },
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          backgroundColor: "primary.main",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography
          variant={isMobile ? "body2" : "body1"}
          sx={{
            fontSize: { xs: "0.8rem", sm: "0.9rem" },
            opacity: 0.9,
          }}
        >
          Sistema de gestión médica para unidades de terapia intensiva.
          Desarrollado para optimizar el seguimiento de pacientes y
          procedimientos médicos.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Home;
