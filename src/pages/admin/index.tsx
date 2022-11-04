import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { Divider, IconButton, Stack, Typography } from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Link from "next/link";
import UserCard from "../../components/UserCard";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const Admin = () => {
  const { data: userInfo, isLoading } = trpc.auth.getUserInfo.useQuery();
  const { data: groupMember } = trpc.auth.getAdminGroupMember.useQuery();

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (userInfo?.role !== "ADMIN") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: 4,
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4">
          SORRY BUT YOU DO NOT HAVE PERMISSION TO ACCESS THIS PAGE
        </Typography>
        <Link href="/">
          <Typography
            sx={{
              cursor: "pointer",
              color: "#0be7ff",
            }}
          >
            go back to home
          </Typography>
        </Link>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary" mb={4}>
        {userInfo.group} ADMIN PANEL
      </Typography>

      <Stack gap={2}>
        <Stack
          direction="row"
          gap={3}
          sx={{
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary">
            User Management
          </Typography>
        </Stack>

        <Stack gap={3}>
          <Box>
            <Stack
              direction="row"
              gap={2}
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography fontSize={17} color="primary.light">
                Admins
              </Typography>

              <IconButton>
                <ManageAccountsIcon
                  sx={{
                    "&.MuiSvgIcon-root": {
                      color: "#007d8e",
                    },
                  }}
                />
              </IconButton>
            </Stack>

            <Stack
              direction="row"
              gap={5}
              sx={{
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              {groupMember &&
                groupMember
                  .filter((r) => r.role === "ADMIN")
                  .map((member) => (
                    <UserCard
                      key={member.id}
                      image={member.image as string}
                      name={member.name as string}
                    />
                  ))}
            </Stack>
          </Box>
          <Divider
            sx={{
              my: 2,
            }}
          />

          <Box>
            <Stack
              direction="row"
              gap={2}
              sx={{
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography fontSize={17} color="primary.light">
                Users
              </Typography>

              <IconButton>
                <ManageAccountsIcon
                  sx={{
                    "&.MuiSvgIcon-root": {
                      color: "#007d8e",
                    },
                  }}
                />
              </IconButton>
            </Stack>

            <Stack
              direction="row"
              gap={2}
              sx={{
                flexWrap: "wrap",
                justifyContent: "flex-start",
              }}
            >
              {groupMember &&
                groupMember
                  .filter((r) => r.role === "USER")
                  .map((member) => (
                    <UserCard
                      key={member.id}
                      image={member.image as string}
                      name={member.name as string}
                    />
                  ))}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Admin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
