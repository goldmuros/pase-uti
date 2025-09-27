import DetalleMedico from "@/pages/DetalleMedico";
import ListaCultivos from "@/pages/ListaCultivos";
import ListaMedicos from "@/pages/ListaMedicos";
import NuevoCultivo from "@/pages/NuevoCultivo";
import NuevoMedico from "@/pages/NuevoMedico";
import NuevoPaciente from "@/pages/NuevoPaciente";
import NuevoPase from "@/pages/NuevoPase";
import DetallePaciente from "../pages/DetallePaciente";
import ErrorBoundary from "../pages/ErrorBoundary";
import Home from "../pages/Home";
import ListaPacientes from "../pages/ListaPacientes";
import ListaPases from "../pages/ListaPases";
import Pase from "../pages/Pase";
import Layout from "./Layout";

const routes = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "medicos",
        children: [
          {
            index: true,
            element: <ListaMedicos />,
          },
          {
            path: "nuevo",
            element: <NuevoMedico />,
          },
          {
            path: ":id",
            element: <DetalleMedico />,
          },
        ],
      },
      {
        path: "pacientes",
        children: [
          {
            index: true,
            element: <ListaPacientes />,
          },
          {
            path: "nuevo",
            element: <NuevoPaciente />,
          },
          {
            path: ":id", // Esto crea la ruta /pacientes/:id
            element: <DetallePaciente />,
          },
          {
            path: "cultivos/:id",
            element: <ListaCultivos />,
          },
        ],
      },
      {
        path: "cultivos",
        children: [
          {
            index: true,
            element: <ListaCultivos />,
          },
          {
            path: "nuevo",
            element: <NuevoCultivo />,
          },
        ],
      },
      {
        path: "pases",
        children: [
          {
            index: true,
            element: <ListaPases />,
          },
          {
            path: "nuevo",
            element: <NuevoPase />,
          },
          {
            path: ":id", // Esto crea la ruta /pacientes/:id
            element: <Pase />,
          },
        ],
      },
    ],
  },
];

export default routes;
