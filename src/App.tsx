import { type ReactNode } from "react";
import { Box, Stack } from "@mui/material";
import SideMenu from "./components/SideMenu";
import Header from "./components/Header";

const App = (): ReactNode => {
	return (
		<Box sx={{ display: "flex" }}>
			<SideMenu />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					overflow: "auto",
				}}
			>
				<Stack
					spacing={2}
					sx={{
						alignItems: "center",
						mx: 3,
						pb: 5,
						mt: { xs: 8, md: 0 },
					}}
				>
					<Header />
					{/* <MainGrid /> */}
					Main
				</Stack>
			</Box>
		</Box>
	);
};

export default App;
