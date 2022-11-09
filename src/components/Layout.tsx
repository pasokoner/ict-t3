import Head from "next/head";
import { signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import { useState } from "react";

import {
  Backdrop,
  Button,
  CssBaseline,
  Fab,
  Stack,
  Typography,
  useTheme,
  Box,
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import MiniDrawer from "../components/Drawer";
import Scanner from "./Scanner";

import { muiTheme } from "../styles/themes";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const { data: userInfo } = trpc.auth.getUserInfo.useQuery();
  const { data: sessionData } = useSession();

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
      <Head>
        <title>ICT Inventory System</title>
        <meta property="og:title" content="ICT Inventory System" key="title" />
      </Head>
      <Box display="flex">
        {sessionData && <MiniDrawer />}
        <Box
          component="main"
          sx={{
            minHeight: "100vh",
            width: "100%",

            ...(sessionData && {
              maxWidth: "xl",
              p: 2,
              margin: "0 auto",
              flexGrow: 1,
            }),
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
          // ...(matches && {
          //   width: "40px",
          //   height: "40px",
          // }),
        }}
      >
        <QrCodeScannerIcon />
      </Fab>
    </ThemeProvider>
  );
};

export default Layout;
