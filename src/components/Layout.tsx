import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Fab } from "@mui/material";

import { muiTheme } from "../styles/themes";

import { Box } from "@mui/material";

import MiniDrawer from "../components/Drawer";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import { useTheme } from "@mui/material";
import Link from "next/link";
import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const theme = useTheme();

  const { data: sessionData } = useSession();

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box display="flex">
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#fefcfb", minHeight: "100vh" }}>
          <Box
            maxWidth="xl"
            sx={{
              height: "100%",
              margin: "0 auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
      <Link href="/camera">
        <Fab sx={{ position: "fixed", bottom: theme.spacing(4), right: theme.spacing(4) }}>
          <QrCodeScannerIcon />
        </Fab>
      </Link>
    </ThemeProvider>
  );
};

export default Layout;
