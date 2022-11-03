import React from "react";

import AddIcon from "@mui/icons-material/Add";

import { Button, Divider, Stack, Typography, Backdrop, Box } from "@mui/material";
import CollapsibleTable from "../components/Table";
import StatusSectionCard from "../components/StatusSectionCard";
import NewDeviceForm from "../components/NewDeviceForm";

import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RemoveIcon from "@mui/icons-material/Remove";

import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { trpc } from "../utils/trpc";
import useMediaQuery from "@mui/material/useMediaQuery";

const Dasboard = () => {
  const { data } = trpc.equiptment.countByStatus.useQuery();

  const matches = useMediaQuery("(max-width:900px)");

  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Box>
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
            >
              Export to Excel
            </Button>

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
          </Stack>
        </Stack>

        <Stack
          direction="row"
          mb={3}
          gap={1}
          sx={{
            justifyContent: { md: "space-between", sm: "space-between", xs: "space-evenly" },
            flexWrap: { md: "nowrap", xs: "wrap" },
          }}
        >
          {data && (
            <>
              <StatusSectionCard
                count={data.inInventory}
                title="In inventory"
                icon={<InventoryIcon />}
                color="success.main"
              />
              <StatusSectionCard
                count={data.forRepair}
                title="For repair"
                icon={<BuildIcon />}
                color="#e3d100"
              />
              <StatusSectionCard
                count={data.toCondemn}
                title="To condemn"
                icon={<PendingActionsIcon />}
                color="warning.main"
              />
              <StatusSectionCard
                count={data.condemned}
                title="Condemned"
                icon={<RemoveIcon />}
                color="error.main"
              />
            </>
          )}
        </Stack>

        <Divider />

        <CollapsibleTable />
      </Stack>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <NewDeviceForm handleClose={handleClose} />
      </Backdrop>
    </Box>
  );
};

export default Dasboard;

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
