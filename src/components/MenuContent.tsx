import {
  LocalHospital as DoctorIcon,
  Home as HomeIcon,
  Assignment as PaseIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MenuContent = (): ReactNode => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Inicio",
      icon: <HomeIcon />,
      path: "/",
    },
    {
      text: "Pacientes",
      icon: <PersonIcon />,
      path: "/pacientes",
    },
    {
      text: "Médico",
      icon: <DoctorIcon />,
      path: "/medico",
    },
    {
      text: "Pases",
      icon: <PaseIcon />,
      path: "/pases",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <List>
      {menuItems.map(item => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            selected={location.pathname === item.path}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default MenuContent;
