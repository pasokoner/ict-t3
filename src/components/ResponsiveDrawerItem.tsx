import Image from "next/image";

import { useSession, signIn, signOut } from "next-auth/react";

import { trpc } from "../utils/trpc";

import { Box, Button, Divider, List, Stack, Typography } from "@mui/material";

import { styled } from "@mui/material/styles";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";

import DrawerItem from "./DrawerItem";

import { drawerItem, drawerSettings } from "../utils/constant";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 1),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const ResponsiveDrawerItem = () => {
  const { data: sessionData } = useSession();

  const { data: userInfo } = trpc.auth.getUserInfo.useQuery();

  return (
    <>
      <DrawerHeader>{/* <Typography>ICT Inventory System</Typography> */}</DrawerHeader>

      {sessionData && (
        <Stack
          direction="row"
          gap={2}
          my={2}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            mt: 4,
          }}
        >
          <Image
            src={sessionData.user?.image as string}
            alt=""
            width={33}
            height={33}
            style={{
              borderRadius: "50%",
            }}
          />
          <Typography fontSize={15}>{sessionData.user?.name}</Typography>
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
              <DrawerItem key={name} open={true} name={name} link={link} icon={icon} />
            ))}

            {userInfo?.role === "SUPERADMIN" && (
              <DrawerItem
                open={true}
                name="Admin"
                link="/super-admin"
                icon={<AdminPanelSettingsIcon />}
              />
            )}

            {userInfo?.role === "ADMIN" && (
              <DrawerItem
                open={true}
                name="Admin"
                link="/admin"
                icon={<AdminPanelSettingsIcon />}
              />
            )}

            {(userInfo?.role === "ADMIN" || userInfo?.role === "SUPERADMIN") && (
              <DrawerItem
                open={true}
                name="Pending Accounts"
                link="/pending-accounts"
                icon={<NoAccountsIcon />}
              />
            )}
          </Box>
        )}

        <Box mt="auto">
          {sessionData &&
            drawerSettings.map(({ name, link, icon }) => (
              <DrawerItem key={name} open={true} name={name} link={link} icon={icon} />
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
    </>
  );
};

export default ResponsiveDrawerItem;
