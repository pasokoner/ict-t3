import React, { useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import { Button, Divider, Paper, Stack, Typography, Backdrop } from "@mui/material";
import CollapsibleTable from "../components/Table";
import StatusSectionCard from "../components/StatusSectionCard";
import { statusSectionItems } from "../utils/constant";
import NewDeviceForm from "../components/NewDeviceForm";

const Dasboard = () => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <Paper sx={{ width: "100%", height: "100%", p: 4 }}>
        <Stack>
          <Stack
            direction="row"
            mb={3}
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="primary">
              Dashboard
            </Typography>

            <Stack direction="row" gap={1}>
              <Button variant="outlined" size="small">
                Export to Excel
              </Button>

              {/* <Button variant="outlined" size="small">
              Import Devices
            </Button> */}

              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleToggle}
              >
                New Device
              </Button>
            </Stack>
          </Stack>

          <Stack
            direction="row"
            mb={3}
            gap={3}
            sx={{
              justifyContent: "space-between",
            }}
          >
            {statusSectionItems.map((item) => (
              <StatusSectionCard
                key={item.title}
                count={item.count}
                title={item.title}
                icon={item.icon}
                color={item.color}
              />
            ))}
          </Stack>

          <Divider />

          <CollapsibleTable />
        </Stack>
      </Paper>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <NewDeviceForm handleClose={handleClose} />
      </Backdrop>
    </>
  );
};

export default Dasboard;
