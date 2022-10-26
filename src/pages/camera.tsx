import React, { useState, useMemo } from "react";
import Scanner from "../components/Scanner";
import { trpc } from "../utils/trpc";

import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

type EquipmentType = {
  name: string;
  id: string;
  status: string;
};

const CameraPage = () => {
  const [cameraResult, setCameraResult] = useState("");

  const { data } = trpc.equiptment.detect.useQuery({ id: cameraResult });

  return (
    <Box>
      <Scanner setCameraResult={setCameraResult} />
      {data && (
        <Stack>
          <Typography>name: {data.name}</Typography>
          <Typography>id: {data.id}</Typography>
        </Stack>
      )}
      <Stack gap={2}>
        <Typography variant="h4">Camera result here:</Typography>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alighItems: "center",
            border: 2,
            p: 2,

            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <Box>
            <Typography>name: Lenovo</Typography>
            <Typography>id: 12342134-2v5312-cwqercq2e5</Typography>
          </Box>

          <IconButton>
            <KeyboardArrowRightIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CameraPage;
