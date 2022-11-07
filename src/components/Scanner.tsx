import Link from "next/link";

import React, { useEffect, useCallback, useState } from "react";

import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

import QrScanner from "qr-scanner";

import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const Scanner = () => {
  const [cameraResult, setCameraResult] = useState("");

  const { data } = trpc.equiptment.detect.useQuery({ id: cameraResult });

  const { data: sessionData } = useSession();

  const theme = useTheme();

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
          heigh: "100%",
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

      <Stack
        sx={{
          position: "fixed",
          top: "80%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: (theme) => theme.zIndex.drawer + 3,
        }}
      >
        <Typography>Camera result here:</Typography>
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
