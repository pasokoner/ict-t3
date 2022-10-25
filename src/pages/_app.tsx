// src/pages/_app.tsx
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import { muiTheme } from "../styles/themes";

import { Box } from "@mui/material";

import MiniDrawer from "../components/Drawer";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Box display="flex">
          <MiniDrawer />
          <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#dcd5f5", minHeight: "100vh" }}>
            <Component {...pageProps} />
          </Box>
        </Box>
      </ThemeProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
