import React from "react";

import { Box, Icon, IconButton, Stack } from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RemoveIcon from "@mui/icons-material/Remove";

type Props = {
  group: string;
  status: string;
  direction: "column" | "row";
  size?: "small";
};

const ActionMaker = ({ group, status, direction, size }: Props) => {
  return (
    <Stack justifyContent="center" direction={direction}>
      {group === "PITO" && status === "In inventory" && (
        <>
          <IconButton size={size}>
            <BuildIcon
              sx={{
                color: "#e3d100",
              }}
            />
          </IconButton>
          <IconButton size={size}>
            <PendingActionsIcon color="warning" />
          </IconButton>
        </>
      )}

      {group === "PITO" && status === "For repair" && (
        <>
          <IconButton size={size}>
            <InventoryIcon color="success" />
          </IconButton>
          <IconButton size={size}>
            <PendingActionsIcon color="warning" />
          </IconButton>
        </>
      )}

      {group === "GSO" && status === "To condemn" && (
        <>
          <IconButton size={size}>
            <RemoveIcon color="error" />
          </IconButton>
        </>
      )}
    </Stack>
  );
};

export default ActionMaker;
