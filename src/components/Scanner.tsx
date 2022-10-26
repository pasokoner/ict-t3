import { Box } from "@mui/material";
import QrScanner from "qr-scanner";
import React, { useEffect, useCallback } from "react";

type Props = {
  setCameraResult: React.Dispatch<React.SetStateAction<string>>;
};

const Scanner = ({ setCameraResult }: Props) => {
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
    <Box
      sx={{
        margin: "0 auto",
        height: { sm: "50vh" },
        width: "100%",
        mb: 3,
      }}
    >
      <video
        id="video-feed"
        style={{
          width: "100%",
          height: "100%",
          // outline: "none",
        }}
      ></video>
    </Box>
  );
};

export default Scanner;
