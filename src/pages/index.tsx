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
            <Box>
              <Typography>Equiptment Name: {data.name}</Typography>
              <Typography>Equiptment Given ID: {data.id}</Typography>
            </Box>
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
