import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { type ReactNode } from "react";
import DrawerHeader from "./DrawerHeader";
import MenuContent from "./MenuContent";

const drawerWidth = 280; // Aumentar ligeramente para mejor usabilidad

// Drawer para desktop (persistente)
const DesktopDrawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    position: "relative", // Evita problemas de z-index en desktop
  },
}));

// Drawer para móvil (temporal)
const MobileDrawer = styled(MuiDrawer)(({ theme }) => ({
  [`& .${drawerClasses.paper}`]: {
    // En móvil (320px), el drawer ocupa el 100% del ancho
    width: "100vw",
    maxWidth: "100vw",
    [theme.breakpoints.up("sm")]: {
      // En tablet y superiores, usa el ancho fijo
      width: drawerWidth,
      maxWidth: drawerWidth,
    },
    boxSizing: "border-box",
  },
}));

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
  isDesktop: boolean;
  isMobile: boolean;
}

const SideMenu = ({
  open,
  onClose,
  isDesktop,
  isMobile,
}: SideMenuProps): ReactNode => {
  // En desktop, usar drawer persistente
  if (isDesktop) {
    return (
      <DesktopDrawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : 0,
          transition: theme =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          [`& .${drawerClasses.paper}`]: {
            width: drawerWidth,
            transition: theme =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
          },
        }}
      >
        <DrawerHeader>
          {/* En desktop no mostramos el botón de cerrar ya que debe estar siempre abierto */}
        </DrawerHeader>
        <Divider />
        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflow: "auto",
          }}
          role="presentation"
        >
          <MenuContent />
          <Divider />
        </Box>
      </DesktopDrawer>
    );
  }

  // En móvil y tablet, usar drawer temporal
  return (
    <MobileDrawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Mejor rendimiento en móviles
      }}
      sx={{
        display: { md: "none" }, // Solo visible en pantallas menores a md
        zIndex: theme => theme.zIndex.drawer + 1,
      }}
    >
      <DrawerHeader>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box
        sx={{
          width: "100%",
          height: "100%",
          overflow: "auto",
          // En móvil muy pequeño, asegurar que el contenido sea clickeable
          minWidth: isMobile ? "100vw" : drawerWidth,
        }}
        role="presentation"
        onClick={onClose} // Cerrar al hacer click en el contenido (comportamiento móvil típico)
      >
        <MenuContent />
        <Divider />
      </Box>
    </MobileDrawer>
  );
};

export default SideMenu;
