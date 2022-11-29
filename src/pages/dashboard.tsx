import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { getSession, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import { useState } from "react";

import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import AddIcon from "@mui/icons-material/Add";

import { Button, Divider, Stack, Typography, Box, Popover, IconButton } from "@mui/material";
import CollapsibleTable from "../components/Table";
import StatusSectionCard from "../components/StatusSectionCard";

import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import ConstructionIcon from "@mui/icons-material/Construction";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RemoveIcon from "@mui/icons-material/Remove";

import useMediaQuery from "@mui/material/useMediaQuery";

import exportFromJSON from "export-from-json";
import { useRouter } from "next/router";

const Dashboard: NextPage = () => {
  const { data: itemsData, isLoading } = trpc.equiptment.countByStatus.useQuery(
    {},
    { refetchOnWindowFocus: false }
  );

  const { data: sessionData } = useSession();

  const [statusFilter, setStatusFilter] = useState(
    sessionData?.user?.group === "PITO" ? "For repair" : "Condemned"
  );

  const matches = useMediaQuery("(max-width:900px)");

  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  if (isLoading) {
    return <></>;
  }

  return (
    <Box>
      <Head>
        {sessionData?.user?.group === "PITO" && itemsData && (
          <title>
            ICT Inventory System ({itemsData?.forRepair > 0 ? itemsData?.forRepair : ""})
          </title>
        )}
        {sessionData?.user?.group === "GSO" && itemsData && (
          <title>
            ICT Inventory System ({itemsData?.toCondemn > 0 ? itemsData?.toCondemn : ""})
          </title>
        )}
        <meta property="og:title" content="ICT Inventory System" key="title" />
      </Head>
      <Stack>
        <Stack
          sx={{
            justifyContent: "space-between",
            flexDirection: "row",
            mb: 3,
            ...(matches && {
              flexDirection: "column",
              rowGap: 3,
            }),
          }}
        >
          <Stack direction="row" gap={2}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              DASHBOARD
            </Typography>

            <IconButton onClick={handleClick}>
              <QuestionMarkIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Stack
                gap={1}
                sx={{
                  p: 2,
                  borderRadius: "5px",
                }}
              >
                <Typography>EQUIPTMENT GUIDE</Typography>
                <Stack direction="row" gap={2}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      border: 2,
                    }}
                  ></Box>
                  <Typography variant="subtitle2">In PGSO inventory and In office</Typography>
                </Stack>

                <Stack direction="row" gap={2}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: "info.light",
                      border: 2,
                    }}
                  ></Box>
                  <Typography variant="subtitle2">In PGSO inventory but not in office</Typography>
                </Stack>

                <Stack direction="row" gap={2}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: "error.light",
                      border: 2,
                    }}
                  ></Box>
                  <Typography variant="subtitle2">
                    In office but not in inventory of PGSO
                  </Typography>
                </Stack>
              </Stack>
            </Popover>
          </Stack>

          <Stack direction="row" gap={1}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                whiteSpace: "nowrap",
              }}
              onClick={() => {
                const data = [{ foo: "foo" }, { bar: "bar" }, { car: "bar" }, { gar: "bar" }];
                const fileName = "download";
                const exportType = exportFromJSON.types.csv;

                exportFromJSON({ data, fileName, exportType });
              }}
            >
              Export to Excel
            </Button>

            {sessionData?.user?.group === "GSO" && (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  router.push("/new-device");
                }}
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                New Device
              </Button>
            )}
          </Stack>
        </Stack>

        <Stack
          mb={1}
          gap={1}
          direction="row"
          sx={{
            flexWrap: "wrap",
            justifyContent: "space-evenly",
          }}
        >
          <StatusSectionCard
            count={itemsData?.inInventory}
            title="In inventory"
            icon={<InventoryIcon />}
            color="success.main"
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />

          <StatusSectionCard
            count={itemsData?.forRepair}
            title="For repair"
            icon={<BuildIcon />}
            color="#e3d100"
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />

          <StatusSectionCard
            count={itemsData?.unserviceable}
            title="Unserviceable"
            icon={<ConstructionIcon />}
            color="grey.500"
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />

          <StatusSectionCard
            count={itemsData?.toCondemn}
            title="To condemn"
            icon={<PendingActionsIcon />}
            color="warning.main"
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />
          <StatusSectionCard
            count={itemsData?.condemned}
            title="Condemned"
            icon={<RemoveIcon />}
            color="error.main"
            setStatusFilter={setStatusFilter}
            statusFilter={statusFilter}
          />
        </Stack>

        <Divider />

        {itemsData && (
          <CollapsibleTable tableFilter={statusFilter} countStatus={itemsData?.inInventory} />
        )}
      </Stack>
    </Box>
  );
};

export default Dashboard;

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

  if (!session?.user?.role && !session?.user?.group) {
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
