export interface Paciente {
	id: string;
	nombre: string;
	apellido: string;
	motivoIngreso?: string;
	activo: boolean;
	fechaIngreso: string;
	cama: string;
}
