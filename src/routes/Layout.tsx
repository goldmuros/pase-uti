import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import SideMenu from "../components/SideMenu";

const Layout = (): ReactNode => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* SideMenu se mantiene estático - NO se re-renderiza */}
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
          <Outlet />
        </Stack>
      </Box>
    </Box>
  );
};

export default Layout;
