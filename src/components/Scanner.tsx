import QrScanner from "qr-scanner";
import React, { useEffect, useState, useCallback } from "react";

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
      console.log("AM I RENDERING");
      myScanner.destroy();
    };
  }, [qrScanner]);

  return (
    <div
      style={{
        margin: "0 auto",
        height: "50vh",
      }}
    >
      <video
        id="video-feed"
        style={{
          width: "100%",
          height: "100%",
          // outline: "none"
        }}
      ></video>
    </div>
  );
};

export default Scanner;
