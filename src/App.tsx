import { Box, Stack } from "@mui/material";
import { type ReactNode } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/Header";
import SideMenu from "./components/SideMenu";
import DetallePaciente from "./pages/DetallePaciente";
import ListaPacientes from "./pages/ListaPacientes";
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
							<Route path="/pacientes" element={<ListaPacientes />} />
							<Route path="/medico" element={<Medico />} />
							<Route path="/pase" element={<Pase />} />
							<Route path="/paciente/:id" element={<DetallePaciente />} />
						</Routes>
					</Stack>
				</Box>
			</Box>
		</Router>
	);
};

export default App;
