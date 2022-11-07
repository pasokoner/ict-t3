import React, { useState } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { Backdrop, Button, CssBaseline, Fab, Stack, Typography } from "@mui/material";

import { muiTheme } from "../styles/themes";

import { Box } from "@mui/material";

import MiniDrawer from "../components/Drawer";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import { useTheme } from "@mui/material";

import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import Scanner from "./Scanner";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const { data: userInfo } = trpc.auth.getUserInfo.useQuery();
  const { data: sessionData } = useSession();

  const matches = useMediaQuery("(max-width:900px)");

  if (userInfo) {
    if (!userInfo.role && !userInfo.group) {
      return (
        <Stack
          direction="column"
          sx={{
            justifyContent: "center",
            alighItems: "center",
            height: "100vh",
          }}
        >
          <Typography align="center">SORRY BUT YOU DO NOT BELONG TO ANY GROUP</Typography>
          <Button
            onClick={() => signOut()}
            variant="text"
            sx={{
              m: "0 auto",
              py: 2,
              px: 2,
            }}
          >
            Sign out
          </Button>
        </Stack>
      );
    }
  }
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box display="flex">
        {sessionData && <MiniDrawer />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            maxWidth: "xl",
            margin: "0 auto",
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        {open && <Scanner />}
      </Backdrop>

      <Fab
        onClick={() => setOpen((prevState) => !prevState)}
        sx={{
          position: "fixed",
          bottom: theme.spacing(2),
          right: theme.spacing(2),
          zIndex: (theme) => theme.zIndex.drawer + 2,
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
    </ThemeProvider>
  );
};

export default Layout;
