import React from "react";

import { Stack, Typography } from "@mui/material";

import QrMaker from "./QrMaker";
import { trpc } from "../utils/trpc";

type Props = {
  id: string;
};

const PrintableQr = (props: Props) => {
  const { id } = props;

  const { data, isLoading } = trpc.equiptment.detect.useQuery({ id: id });

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{
        maxWidth: 140,
        p: 0.5,
        mb: "auto",
        border: 1,
      }}
    >
      <QrMaker value={id} />

      <Typography
        fontSize={10}
        fontWeight="bold"
        sx={{
          wordBreak: "break-word",
        }}
      >
        {data?.department}
      </Typography>
      <Typography
        fontSize={10}
        sx={{
          wordBreak: "break-word",
        }}
      >
        {data?.serial}
      </Typography>
    </Stack>
  );
};

export default PrintableQr;
