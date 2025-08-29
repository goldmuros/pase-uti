import { type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/routes";

const App = (): ReactNode => {
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default App;
