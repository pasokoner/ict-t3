import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";

import { getSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  useMediaQuery,
} from "@mui/material";

import PendingRows from "../components/PendingRows";

const PendingAccounts: NextPage = () => {
  const { data: userInfo, isLoading } = trpc.auth.getUserInfo.useQuery();
  const { data: pendingAccounts, refetch } = trpc.auth.getPendingAccounts.useQuery();

  const matches = useMediaQuery("(max-width:600px)");

  const fetchPendingAccounts = async () => {
    await refetch();
  };

  if (isLoading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (userInfo?.role === "USER") {
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
        width: "100%",
      }}
    >
      <Typography variant="h4" fontWeight="bold" color="primary" mb={4}>
        PENDING ACCOUNTS
      </Typography>

      <Stack gap={3}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Pending account(s) - {pendingAccounts?.length}
        </Typography>

        <TableContainer>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow
                sx={{
                  "& .MuiTableCell-root": {
                    fontWeight: "bold",
                  },
                }}
              >
                <TableCell>Name</TableCell>
                {!matches && <TableCell>Email</TableCell>}

                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingAccounts &&
                pendingAccounts.map(({ email, name, id }) => (
                  <PendingRows
                    key={id}
                    name={name as string}
                    email={email as string}
                    id={id}
                    userRole={userInfo?.role as string}
                    userGroup={userInfo?.group as "PITO" | "GSO"}
                    fetchPendingAccounts={fetchPendingAccounts}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
};

export default PendingAccounts;

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
