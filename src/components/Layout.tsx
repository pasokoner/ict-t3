import React from "react";

import { ThemeProvider } from "@mui/material/styles";
import { Button, CssBaseline, Fab, Stack, Typography } from "@mui/material";

import { muiTheme } from "../styles/themes";

import { Box } from "@mui/material";

import MiniDrawer from "../components/Drawer";

import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";

import { useTheme } from "@mui/material";
import Link from "next/link";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";
import { signOut } from "next-auth/react";
import { trpc } from "../utils/trpc";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const theme = useTheme();
  const { data: userInfo } = trpc.auth.getUserInfo.useQuery();

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
        <MiniDrawer />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // bgcolor: "#fefcfb",
            minHeight: "100vh",
            maxWidth: "xl",
            margin: "0 auto",
            p: 3,
          }}
        >
          {children}
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
