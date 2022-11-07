import React from "react";

import { IconButton, Stack, Backdrop } from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RemoveIcon from "@mui/icons-material/Remove";
import NewDeviceForm from "./NewDeviceForm";
import { stat } from "fs";

type Props = {
  group: string;
  status: string;
  direction: "column" | "row";
  id: string;
  size?: "small";
  name: string;
};

const ActionMaker = ({ group, status, direction, size, name, id }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [updatedStatus, setUpdatedStatus] = React.useState<string | undefined>();

  const handleClose = () => {
    setUpdatedStatus(undefined);
    setOpen(false);
  };
  const handleToggle = (newStatus: string) => {
    setUpdatedStatus(newStatus);
    setOpen(!open);
  };

  return (
    <>
      <Stack justifyContent="center" direction={direction}>
        {group === "PITO" && status === "In inventory" && (
          <>
            <IconButton
              size={size}
              onClick={() => {
                handleToggle("For repair");
              }}
            >
              <BuildIcon
                sx={{
                  color: "#e3d100",
                }}
              />
            </IconButton>
            <IconButton
              size={size}
              onClick={() => {
                handleToggle("To condemn");
              }}
            >
              <PendingActionsIcon color="warning" />
            </IconButton>
          </>
        )}

        {group === "PITO" && status === "For repair" && (
          <>
            <IconButton
              size={size}
              onClick={() => {
                handleToggle("In inventory");
              }}
            >
              <InventoryIcon color="success" />
            </IconButton>
            <IconButton
              size={size}
              onClick={() => {
                handleToggle("To condemn");
              }}
            >
              <PendingActionsIcon color="warning" />
            </IconButton>
          </>
        )}

        {group === "GSO" && status === "To condemn" && (
          <>
            <IconButton
              size={size}
              onClick={() => {
                handleToggle("Condemned");
              }}
            >
              <RemoveIcon color="error" />
            </IconButton>
          </>
        )}
      </Stack>

      {/* {updatedStatus && !name && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <NewDeviceForm handleClose={handleClose} status={updatedStatus} />
        </Backdrop>
      )} */}

      {updatedStatus && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <NewDeviceForm
            handleClose={handleClose}
            status={updatedStatus}
            equiptment={name}
            update={true}
            equiptmentId={id}
          />
        </Backdrop>
      )}
    </>
  );
};

export default ActionMaker;
