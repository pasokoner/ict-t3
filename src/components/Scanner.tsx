import Link from "next/link";

import React, { useEffect, useCallback, useState } from "react";

import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

import QrScanner from "qr-scanner";

import { Box, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Scanner = () => {
  const [cameraResult, setCameraResult] = useState("");

  const { data } = trpc.equiptment.detect.useQuery({ id: cameraResult });

  const { data: sessionData } = useSession();

  const qrScanner = useCallback(() => {
    return new QrScanner(
      document.getElementById("video-feed") as HTMLVideoElement,
      (result: { data: string }) => {
        setCameraResult(result.data);
      },
      {
        /* your options or returnDetailedScanResult: true if you're not specifying any other options */
      }
    );
  }, [setCameraResult]);

  useEffect(() => {
    const myScanner = qrScanner();

    myScanner.start();

    return () => {
      myScanner.destroy();
    };
  }, [qrScanner]);

  return (
    <Stack
      sx={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          // height: "50%",
          width: "100%",
          mb: "auto",
        }}
      >
        <video
          id="video-feed"
          style={{
            width: "100%",
            height: "100%",
          }}
        ></video>
      </Box>

      <Stack gap={2}>
        {/* <Typography variant="h4">Camera result here:</Typography> */}
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
    </Stack>
  );
};

export default Scanner;
