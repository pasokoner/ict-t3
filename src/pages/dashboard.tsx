import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { getSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import { useState, useEffect } from "react";

import AddIcon from "@mui/icons-material/Add";

import { Button, Divider, Stack, Typography, Backdrop, Box } from "@mui/material";
import CollapsibleTable from "../components/Table";
import StatusSectionCard from "../components/StatusSectionCard";
import NewDeviceForm from "../components/NewDeviceForm";

import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RemoveIcon from "@mui/icons-material/Remove";

import useMediaQuery from "@mui/material/useMediaQuery";

import exportFromJSON from "export-from-json";

const Dashboard: NextPage = () => {
  const { data: itemsData, refetch } = trpc.equiptment.countByStatus.useQuery();
  const { data: userInfo } = trpc.auth.getUserInfo.useQuery();

  const [statusFilter, setStatusFilter] = useState("");
  const [open, setOpen] = useState(false);

  const matches = useMediaQuery("(max-width:900px)");

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleRefetch = () => {
    refetch();
  };

  useEffect(() => {
    setStatusFilter(userInfo?.group === "PITO" ? "For repair" : "Condemned");
  }, [userInfo]);

  return (
    <Box>
      <Head>
        {userInfo?.group === "PITO" && itemsData && (
          <title>
            ICT Inventory System ({itemsData?.forRepair > 0 ? itemsData?.forRepair : ""})
          </title>
        )}
        {userInfo?.group === "GSO" && itemsData && (
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
          <Typography variant="h4" fontWeight="bold" color="primary">
            DASHBOARD
          </Typography>

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

            {userInfo?.group === "GSO" && (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleToggle}
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
          mb={3}
          gap={1}
          direction="row"
          sx={{
            justifyContent: { md: "space-between", xs: "space-evenly" },
            flexWrap: { md: "nowrap", xs: "wrap" },
          }}
        >
          <>
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
          </>
        </Stack>

        <Divider />

        {itemsData && (
          <CollapsibleTable tableFilter={statusFilter} countStatus={itemsData?.inInventory} />
        )}
      </Stack>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <NewDeviceForm
          handleClose={handleClose}
          status="In inventory"
          handleRefetch={handleRefetch}
        />
      </Backdrop>
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

  return {
    props: { session },
  };
};
