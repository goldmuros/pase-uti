import { type ReactNode } from "react";
import { Box, Stack } from "@mui/material";
import SideMenu from "./components/SideMenu";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Paciente from "./pages/Paciente";
import Medico from "./pages/Medico";
import Pase from "./pages/Pase";

// Componente Home simple
const Home = () => {
	return (
		<Box>
			<h1>Bienvenido al Sistema Médico</h1>
			<p>Selecciona una opción del menú lateral para comenzar.</p>
		</Box>
	);
};

const App = (): ReactNode => {
	return (
		<Router>
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
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/paciente" element={<Paciente />} />
							<Route path="/medico" element={<Medico />} />
							<Route path="/pase" element={<Pase />} />
						</Routes>
					</Stack>
				</Box>
			</Box>
		</Router>
	);
};

export default App;
