import { type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
} from "@mui/material";
import {
	Person as PersonIcon,
	LocalHospital as DoctorIcon,
	Assignment as PaseIcon,
	Home as HomeIcon,
} from "@mui/icons-material";

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
			text: "Paciente",
			icon: <PersonIcon />,
			path: "/paciente",
		},
		{
			text: "Médico",
			icon: <DoctorIcon />,
			path: "/medico",
		},
		{
			text: "Pase",
			icon: <PaseIcon />,
			path: "/pase",
		},
	];

	const handleNavigation = (path: string) => {
		navigate(path);
	};

	return (
		<>
			<List>
				{menuItems.map((item) => (
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
			<Divider />
		</>
	);
};

export default MenuContent;
