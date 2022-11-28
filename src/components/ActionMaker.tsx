import { useState } from "react";

import { IconButton, Stack, Backdrop, Box } from "@mui/material";

import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import ConstructionIcon from "@mui/icons-material/Construction";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RemoveIcon from "@mui/icons-material/Remove";

import NewDeviceForm from "./NewDeviceForm";
import RepairForm from "./action-form/RepairForm";
import CondemningForm from "./action-form/CondemningForm";
import InventoryForm from "./action-form/InventoryForm";
import CondemnForm from "./action-form/CondemnForm";
import CondemnPartsForm from "./action-form/CondemnParts";

type Props = {
  group: string;
  status: string;
  direction: "column" | "row";
  id: string;
  size?: "small";
  name: string;
  isParts?: boolean;
  serial?: string;
  lastChecked: Date;
};

const ActionMaker = ({
  group,
  status,
  direction,
  size,
  name,
  id,
  isParts = false,
  serial,
  lastChecked,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState<string | undefined>();

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

        {group === "GSO" && status === "Unserviceable" && (
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
      {updatedStatus === "For repair" && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <Box
            sx={{
              width: "100vw",
            }}
          >
            <RepairForm
              handleClose={handleClose}
              updatedStatus={updatedStatus}
              equiptmentName={name}
              equiptmentId={id}
              status={status}
              lastChecked={lastChecked}
            />
          </Box>
        </Backdrop>
      )}

      {updatedStatus === "To condemn" && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <Box
            sx={{
              width: "100vw",
            }}
          >
            <CondemningForm
              handleClose={handleClose}
              updatedStatus={updatedStatus}
              equiptmentName={name}
              equiptmentId={id}
              status={status}
              lastChecked={lastChecked}
            />
          </Box>
        </Backdrop>
      )}

      {updatedStatus === "In inventory" && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <Box
            sx={{
              width: "100vw",
            }}
          >
            <InventoryForm
              handleClose={handleClose}
              updatedStatus={updatedStatus}
              equiptmentName={name}
              equiptmentId={id}
              status={status}
              lastChecked={lastChecked}
            />
          </Box>
        </Backdrop>
      )}

      {updatedStatus === "Condemned" && !isParts && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <Box
            sx={{
              width: "100vw",
            }}
          >
            <CondemnForm
              handleClose={handleClose}
              updatedStatus={updatedStatus}
              equiptmentName={name}
              equiptmentId={id}
              status={status}
              lastChecked={lastChecked}
            />
          </Box>
        </Backdrop>
      )}

      {updatedStatus === "Condemned" && isParts && serial && (
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <Box
            sx={{
              width: "100vw",
            }}
          >
            <CondemnPartsForm
              handleClose={handleClose}
              equiptmentName={name}
              equiptmentId={id}
              serial={serial}
              lastChecked={lastChecked}
            />
          </Box>
        </Backdrop>
      )}
    </>
  );
};

export default ActionMaker;
