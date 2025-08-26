import {
	Bed as BedIcon,
	LocalHospital as HospitalIcon,
	Person as PersonIcon,
} from "@mui/icons-material";
import { Box, Card, CardHeader, Chip, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Paciente } from "../types/Paciente";

const pacientesIniciales: Paciente[] = [
	{
		id: "1",
		nombre: "María Elena",
		apellido: "González Pérez",
		cama: "A-101",
		activo: true,
		fechaIngreso: "2024-08-20",
	},
	{
		id: "2",
		nombre: "Carlos Alberto",
		apellido: "Rodríguez Silva",
		cama: "A-110",
		activo: true,
		fechaIngreso: "2024-08-19",
	},
	{
		id: "3",
		nombre: "Ana Sofía",
		apellido: "Martínez López",
		cama: "A-112",
		activo: false,
		fechaIngreso: "2024-08-15",
	},
];

const ListaPacientesMejorada = () => {
	const navigate = useNavigate();

	const [pacientes, setPacientes] = useState(pacientesIniciales);

	const irDetallePaciente = (pacienteId: string) => {
		navigate(`paciente/${pacienteId}`);
	};

	return (
		<Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
			<Box sx={{ mb: 3 }}>
				<Typography
					variant="h4"
					sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
				>
					<HospitalIcon sx={{ mr: 1, verticalAlign: "middle" }} />
					Gestión de Pacientes
				</Typography>
			</Box>

			{/* Lista de pacientes */}
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: {
						xs: "1fr",
						sm: "repeat(auto-fill, minmax(400px, 1fr))",
						md: "repeat(auto-fill, minmax(450px, 1fr))",
					},
					gap: 3,
					mb: 4,
				}}
			>
				{pacientes.map((paciente) => (
					<Card
						key={paciente.id}
						elevation={2}
						sx={{
							cursor: "pointer",
							opacity: paciente.activo ? 1 : 0.7,
							border: paciente.activo
								? "2px solid transparent"
								: "2px dashed #ccc",
							"&:hover": {
								boxShadow: 4,
								transform: "translateY(-2px)",
								transition: "all 0.2s ease-in-out",
							},
						}}
						onClick={() => irDetallePaciente(paciente.id)}
					>
						<CardHeader
							avatar={
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<PersonIcon
										color={paciente.activo ? "primary" : "disabled"}
									/>
								</Box>
							}
							title={
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Typography variant="h6" sx={{ fontWeight: "bold" }}>
										{paciente.nombre} {paciente.apellido}
									</Typography>
									<Chip
										size="small"
										label={paciente.activo ? "Activo" : "Inactivo"}
										color={paciente.activo ? "success" : "default"}
										variant={paciente.activo ? "filled" : "outlined"}
									/>
								</Box>
							}
							subheader={
								<Box>
									<Typography
										variant="body2"
										sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
									>
										<BedIcon fontSize="small" />
										Cama: {paciente.cama}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Ingreso: {paciente.fechaIngreso}
									</Typography>
								</Box>
							}
						/>
					</Card>
				))}
			</Box>
		</Box>
	);
};

export default ListaPacientesMejorada;
