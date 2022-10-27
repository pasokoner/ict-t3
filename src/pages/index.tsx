import type { NextPage } from "next";

import React, { useState } from "react";
import Scanner from "../components/Scanner";
import { trpc } from "../utils/trpc";

import { Box, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Home: NextPage = () => {
  const [cameraResult, setCameraResult] = useState("");

  const { data } = trpc.equiptment.detect.useQuery({ id: cameraResult });

  const { data: sessionData } = useSession();

  return (
    <Box>
      <Scanner setCameraResult={setCameraResult} />

      <Stack gap={2}>
        <Typography variant="h4">Camera result here:</Typography>
        {data && (
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
            {cameraResult && data && (
              <Stack>
                <Typography>name: {data.name}</Typography>
                <Typography>id: {data.id}</Typography>
              </Stack>
            )}

            {cameraResult && data === null && (
              <Stack>
                <Typography>Qr Code does not exist on our end</Typography>
              </Stack>
            )}
            {!sessionData && (
              <Link href="https://intranet.bataan.gov.ph">
                <IconButton>
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Link>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default Home;
