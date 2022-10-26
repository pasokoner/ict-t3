import * as React from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { Button, Stack, Typography } from "@mui/material";

import DrawerItem from "./DrawerItem";
import { drawerItem, drawerSettings } from "../utils/constant";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Box } from "@mui/system";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
      ...openedMixin(theme),
      "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      "& .MuiDrawer-paper": closedMixin(theme),
    }),
  })
);

export default function MiniDrawer() {
  const [open, setOpen] = React.useState(true);

  const { data: sessionData } = useSession();

  const toggleDrawer = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          color: "regular.white",
          bgcolor: "primary.main",
        },

        "& .MuiListItem-root": {
          "&:hover": {
            bgcolor: "primary.light",
          },
        },

        "& .MuiSvgIcon-root": {
          color: "regular.white",
        },
      }}
    >
      <DrawerHeader>
        {open && <Typography>ICT Inventory System</Typography>}
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      {sessionData && (
        <Stack
          pl={2}
          direction="row"
          gap={2}
          my={3}
          sx={{
            alignItems: "center",
          }}
        >
          <Image
            src={sessionData.user?.image as string}
            alt=""
            width={40}
            height={40}
            style={{
              borderRadius: "50%",
            }}
          />
          {open && <Typography>{sessionData.user?.name}</Typography>}
        </Stack>
      )}

      <Divider />
      <List
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {sessionData && (
          <Box>
            {drawerItem.map(({ name, link, icon }) => (
              <DrawerItem key={name} open={open} name={name} link={link} icon={icon} />
            ))}
          </Box>
        )}

        <Box mt="auto">
          {sessionData &&
            drawerSettings.map(({ name, link, icon }) => (
              <DrawerItem key={name} open={open} name={name} link={link} icon={icon} />
            ))}

          <Button
            onClick={sessionData ? () => signOut() : () => signIn()}
            variant="outlined"
            fullWidth
            sx={{
              m: "0 auto",
              py: 2,
              px: 2,
              color: "white",
              bgcolor: "primary.light",

              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            {sessionData ? "Sign out" : "Sign in"}
          </Button>
        </Box>
      </List>
    </Drawer>
  );
}
