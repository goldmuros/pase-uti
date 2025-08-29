import DetallePaciente from "../pages/DetallePaciente";
import ErrorBoundary from "../pages/ErrorBoundary";
import Home from "../pages/Home";
import ListaPacientes from "../pages/ListaPacientes";
import ListaPases from "../pages/ListaPases";
import Medico from "../pages/Medico";
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
        path: "pacientes",
        children: [
          {
            index: true,
            element: <ListaPacientes />,
          },
          {
            path: ":id", // Esto crea la ruta /pacientes/:id
            element: <DetallePaciente />,
          },
        ],
      },
      {
        path: "medico",
        element: <Medico />,
      },
      {
        path: "pases",
        children: [
          {
            index: true,
            element: <ListaPases />,
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
