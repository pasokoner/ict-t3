import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { trpc } from "../utils/trpc";

const PendingAccounts = () => {
  const { data: userInfo, isLoading } = trpc.auth.getUserInfo.useQuery();

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (userInfo?.role !== "SUPERADMIN") {
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

  return <div>PendingAccounts</div>;
};

export default PendingAccounts;
