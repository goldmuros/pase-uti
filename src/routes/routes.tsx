import Cultivo from "@/pages/Cultivo";
import ListaCultivos from "@/pages/ListaCultivos";
import ListaMedicos from "@/pages/ListaMedicos";
import Medico from "@/pages/Medico";
import NuevoPaciente from "@/pages/NuevoPaciente";
import Paciente from "@/pages/Paciente";
import Pase from "@/pages/Pase";
import ErrorBoundary from "../pages/ErrorBoundary";
import Home from "../pages/Home";
import ListaPacientes from "../pages/ListaPacientes";
import ListaPases from "../pages/ListaPases";
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
            element: <Medico />,
          },
          {
            path: ":id",
            element: <Medico />,
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
            path: ":id",
            element: <Paciente />,
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
            element: <Cultivo />,
          },
          {
            path: ":id/editar",
            element: <Cultivo />,
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
            element: <Pase />,
          },
          {
            path: ":id",
            element: <Pase />,
          },
        ],
      },
    ],
  },
];

export default routes;
