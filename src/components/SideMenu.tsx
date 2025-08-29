import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import MenuContent from "./MenuContent";
import Divider from "@mui/material/Divider";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
	width: drawerWidth,
	flexShrink: 0,
	boxSizing: "border-box",
	mt: 10,
	[`& .${drawerClasses.paper}`]: {
		width: drawerWidth,
		boxSizing: "border-box",
	},
});

const SideMenu = (): ReactNode => {
	return (
		<Drawer
			variant="permanent"
			sx={{
				display: { xs: "none", md: "block" },
				[`& .${drawerClasses.paper}`]: {
					backgroundColor: "background.paper",
				},
			}}
		>
			<Box
				sx={{
					overflow: "auto",
					height: "100%",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<MenuContent />
				<Divider />
			</Box>
		</Drawer>
	);
};

export default SideMenu;
