import React from "react";
import { useQrCart } from "../QrCartContext";

import { Drawer, Typography, Box, List, Divider, Button, Stack } from "@mui/material";
import QrCartItem from "./QrCartItem";
import { useRouter } from "next/router";

type Props = {
  isOpen: boolean;
};

const QrCart = (props: Props) => {
  const { isOpen } = props;

  const { closeCart, cartItems } = useQrCart();

  const router = useRouter();

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={closeCart}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Stack
        sx={{
          width: 270,
          p: 1,
          height: "100%",
        }}
      >
        <Typography gutterBottom fontSize={30} align="center" fontWeight="medium">
          Pending QR
        </Typography>
        <Divider />

        <List>
          {cartItems &&
            cartItems.map(({ id, quantity }) => (
              <React.Fragment key={id}>
                <QrCartItem id={id} quantity={quantity} />
                <Divider sx={{ mt: 1 }} />
              </React.Fragment>
            ))}
        </List>

        <Button
          variant="contained"
          onClick={() => {
            router.push("/print-qr");
          }}
          sx={{
            mt: "auto",
            p: 2,
          }}
        >
          Start Printing
        </Button>
      </Stack>
    </Drawer>
  );
};

export default QrCart;
