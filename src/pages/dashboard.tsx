import React from "react";

import AddIcon from "@mui/icons-material/Add";

import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import CollapsibleTable from "../components/Table";

const Dasboard = () => {
  return (
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
            Orders
          </Typography>

          <Stack direction="row" gap={1}>
            <Button variant="outlined" size="small">
              Export to Excel
            </Button>

            <Button variant="outlined" size="small">
              Import Devices
            </Button>

            <Button variant="contained" size="small" startIcon={<AddIcon />}>
              New Device
            </Button>
          </Stack>
        </Stack>

        <Divider />

        <CollapsibleTable />
      </Stack>
    </Paper>
  );
};

export default Dasboard;
