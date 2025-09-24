import AppHeader from "@/components/AppHeader";
import DrawerHeader from "@/components/DrawerHeader";
import { useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { useEffect, useState, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu";

const drawerWidth = 280;

const Main = styled("main", {
  shouldForwardProp: prop => prop !== "open" && prop !== "isDesktop",
})<{
  open?: boolean;
  isDesktop?: boolean;
}>(({ theme, open, isDesktop }) => ({
  flexGrow: 1,
  padding: theme.spacing(0.5, 0.5, 2), // Padding aún más reducido para móviles pequeños
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // En móvil: sin margin cuando está cerrado
  marginLeft: isDesktop && !open ? `-${drawerWidth}px` : 0,

  // Variantes según el estado
  ...(open &&
    isDesktop && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),

  // Responsive padding - mejor escalado
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(1, 1, 2.5),
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(2, 2, 3),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(3),
  },
}));

const Layout = (): ReactNode => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // 900px+
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px

  // Estado del drawer
  const [open, setOpen] = useState(false);

  // Efecto para manejar el estado inicial según el tamaño de pantalla
  useEffect(() => {
    if (isDesktop) {
      // En desktop, el drawer está abierto por defecto
      setOpen(true);
    } else {
      // En móvil y tablet, el drawer está cerrado por defecto
      setOpen(false);
    }
  }, [isDesktop]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppHeader
        open={open && isDesktop}
        onClick={handleDrawerToggle}
        isDesktop={isDesktop}
      />
      <SideMenu
        open={open}
        onClose={handleDrawerClose}
        isDesktop={isDesktop}
        isMobile={isMobile}
      />
      <Main open={open} isDesktop={isDesktop}>
        <DrawerHeader />
        <Box
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            width: "100%",
            maxWidth: "100%",
          }}
        >
          <Stack
            spacing={{ xs: 0.5, sm: 1, md: 2 }}
            sx={{
              alignItems: "center",
              mx: { xs: 0.5, sm: 1, md: 2, lg: 3 },
              pb: { xs: 2, sm: 3, md: 4, lg: 5 },
              mt: { xs: 8, md: 0 },
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            <Outlet />
          </Stack>
        </Box>
      </Main>
    </Box>
  );
};

export default Layout;
