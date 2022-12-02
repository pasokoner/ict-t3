import React from "react";
import { trpc } from "../../utils/trpc";

import {
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import QrMaker from "../../components/QrMaker";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useQrCart } from "../QrCartContext";

type Props = {
  id: string;
  quantity: number;
};

const QrCartItem = (props: Props) => {
  const { id, quantity } = props;
  const { data, isLoading } = trpc.equiptment.detect.useQuery({ id: id });

  const { increaseCartQuantity, decreaseCartQuantity } = useQrCart();

  if (isLoading) {
    return <></>;
  }

  return (
    <ListItem
      secondaryAction={
        <Stack>
          <IconButton
            edge="end"
            size="small"
            onClick={() => {
              increaseCartQuantity(id, data?.department as string);
            }}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            edge="end"
            size="small"
            onClick={() => {
              decreaseCartQuantity(id);
            }}
          >
            <RemoveIcon />
          </IconButton>
        </Stack>
      }
    >
      <Typography
        align="center"
        sx={{
          p: 0.5,
          mr: 1,
          color: "white",
          bgcolor: "error.light",
          minWidth: 38,
        }}
      >
        {quantity > 99 ? "99+" : quantity}
      </Typography>
      <ListItemText
        primary={data?.name}
        sx={{
          wordBreak: "break-word",
        }}
      />
    </ListItem>
  );
};

export default QrCartItem;
