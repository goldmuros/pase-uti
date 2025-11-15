import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { es } from "date-fns/locale";
import { type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/routes";

const App = (): ReactNode => {
  const router = createBrowserRouter(routes, {
    basename: process.env.NODE_ENV === "production" ? "/pase-uti/" : "/",
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <RouterProvider router={router} />{" "}
    </LocalizationProvider>
  );
};

export default App;
