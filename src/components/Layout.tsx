import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Fab } from "@mui/material";

import { muiTheme } from "../styles/themes";

import { Box } from "@mui/material";

import MiniDrawer from "../components/Drawer";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import { useTheme } from "@mui/material";
import Link from "next/link";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const theme = useTheme();

  const matches = useMediaQuery("(max-width:900px)");

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box display="flex">
        <MiniDrawer />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#fefcfb",
            minHeight: "100vh",
            ...(!matches && {
              p: 3,
            }),
          }}
        >
          <Box
            maxWidth="xl"
            sx={{
              height: "100vh",
              margin: "0 auto",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
      <Link href="/">
        <Fab
          sx={{
            position: "fixed",
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            ...(matches && {
              width: "40px",
              height: "40px",
            }),
          }}
        >
          <QrCodeScannerIcon
            sx={{
              ...(matches && {
                fontSize: 20,
              }),
            }}
          />
        </Fab>
      </Link>
    </ThemeProvider>
  );
};

export default Layout;
