import {
  LocalHospital as DoctorIcon,
  Home as HomeIcon,
  Assignment as PaseIcon,
  Person as PersonIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MenuContent = (): ReactNode => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuItems = [
    {
      text: "Inicio",
      icon: <HomeIcon />,
      path: "/",
      description: "Página principal del sistema",
    },
    {
      text: "Pacientes",
      icon: <PersonIcon />,
      path: "/pacientes",
      description: "Gestión de pacientes",
    },
    {
      text: "Cultivos",
      icon: <ScienceIcon />,
      path: "/cultivos",
      description: "Gestión de cultivos",
    },
    {
      text: "Médicos",
      icon: <DoctorIcon />,
      path: "/medicos",
      description: "Gestión de médicos",
    },
    {
      text: "Pases",
      icon: <PaseIcon />,
      path: "/pases",
      description: "Historial de pases médicos",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Determinar si estamos en una ruta hija
  const isActiveRoute = (itemPath: string) => {
    if (itemPath === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(itemPath);
  };

  return (
    <List sx={{ px: 0 }}>
      {menuItems.map(item => (
        <ListItem
          key={item.text}
          disablePadding
          sx={{
            mb: 0.5,
            "&:last-child": {
              mb: 0,
            },
          }}
        >
          <ListItemButton
            selected={isActiveRoute(item.path)}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: { xs: 0, sm: 2 },
              mx: { xs: 0, sm: 1 },
              py: { xs: 1.5, sm: 1.5, md: 2 },
              px: { xs: 1, sm: 2 },
              minHeight: { xs: 48, sm: 48, md: 56 },
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
              "&:hover": {
                backgroundColor: "action.hover",
                borderRadius: { xs: 0, sm: 2 },
              },
              // Estilos específicos para móvil
              ...(isMobile && {
                justifyContent: "flex-start",
                gap: 1.5,
              }),
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: { xs: 48, sm: 40 },
                justifyContent: "center",
                "& svg": {
                  fontSize: { xs: 28, sm: 24 },
                },
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: isActiveRoute(item.path) ? "bold" : "medium",
                    fontSize: { xs: "1.1rem", sm: "1rem" },
                  }}
                >
                  {item.text}
                </Typography>
              }
              secondary={
                isMobile && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.875rem",
                      mt: 0.5,
                    }}
                  >
                    {item.description}
                  </Typography>
                )
              }
              sx={{
                "& .MuiListItemText-primary": {
                  mb: isMobile ? 0.5 : 0,
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default MenuContent;
