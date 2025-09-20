import MenuIcon from "@mui/icons-material/Menu";
import { IconButton, styled, Toolbar, Typography } from "@mui/material";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";

import type { ReactNode } from "react";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  isDesktop?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open" && prop !== "isDesktop",
})<AppBarProps>(({ theme, open, isDesktop }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  // En desktop: ajustar ancho cuando el drawer está abierto
  ...(isDesktop &&
    open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),

  // En móvil y tablet: siempre ocupar todo el ancho
  ...(!isDesktop && {
    width: "100%",
    marginLeft: 0,
  }),
}));

interface AppHeaderProps {
  open: boolean;
  onClick: () => void;
  isDesktop: boolean;
}

const AppHeader = ({ open, onClick, isDesktop }: AppHeaderProps): ReactNode => {
  return (
    <AppBar position="fixed" open={open} isDesktop={isDesktop}>
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 }, // Altura responsive
          px: { xs: 1, sm: 2 }, // Padding responsive
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onClick}
          edge="start"
          sx={{
            mr: 2,
            // Ocultar cuando el drawer está abierto
            display: open ? "none" : "flex",
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" }, // Mejor escalado
            fontWeight: "medium",
            // Mejor manejo de texto largo en móviles
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: { xs: "180px", sm: "none" }, // Limitar ancho en móviles
          }}
        >
          {isDesktop ? "Sistema de Pases Médicos" : "Pases Médicos"}
        </Typography>

        {/* Indicador de estado para desarrollo (opcional) */}
        {process.env.NODE_ENV === "development" && (
          <Typography
            variant="caption"
            sx={{
              opacity: 0.7,
              display: { xs: "none", sm: "block" },
              fontSize: "0.75rem",
            }}
          >
            {isDesktop ? "Desktop" : "Mobile"}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
