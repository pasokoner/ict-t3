import Link from "next/link";

import React, { useEffect, useCallback, useState } from "react";

import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

import QrScanner from "qr-scanner";

import { Box, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { statusColorGenerator, getFormattedDate } from "../utils/constant";
import ActionMaker from "./ActionMaker";

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
        highlightScanRegion: true,
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
    <>
      <Box
        sx={{
          // height: "50%",
          width: "100vw",
          heigh: "100vh",
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
          borderRadius: "15px",
          zIndex: (theme) => theme.zIndex.drawer + 3,
        }}
      >
        {/* <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alighItems: "center",
            minWidth: "70vw",
            maxWidth: "95vw",
            borderRadius: "10px",
            border: 1,
            borderColor: "grey.500",
            p: 1.5,

            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          <Stack
            sx={{
              flexGrow: 1,
              "& .MuiTypography-root": {
                fontSize: { md: 17, xs: 14 },
              },
            }}
          >
            <Typography>Equiptment: Lenovo</Typography>
            <Typography>Last Checked: 01/01/2000</Typography>
            <Typography>
              Status:{" "}
              <Typography
                component="span"
                sx={{
                  bgcolor: statusColorGenerator("In inventory"),
                  borderRadius: "5px",
                  color: "white",
                  width: "100px",
                  height: "15px",
                  py: 0.3,
                  px: 0.5,
                }}
              >
                In inventory
              </Typography>
            </Typography>
          </Stack>
          <Stack
            justifyContent="center"
            sx={{
              p: 1,
              bgcolor: "grey.500",
              heigth: "100%",
            }}
          >
            <ActionMaker status="In inventory" group="PITO" direction="column" id="sdasdsa" />
          </Stack>
        </Stack> */}
        {data && (
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alighItems: "center",
              minWidth: { md: "50vw", xs: "80vw" },
              maxWidth: "95vw",
              borderRadius: "10px",
              border: 1,
              borderColor: "grey.500",
              p: 2,

              "& .MuiTypography-root": {
                fontSize: 14,
              },
            }}
          >
            {cameraResult && data && (
              <>
                <Stack
                  sx={{
                    flexGrow: 1,
                    justifyContent: "center",
                    "& .MuiTypography-root": {
                      fontSize: { md: 17 },
                    },
                  }}
                >
                  <Typography>
                    Equiptment:{" "}
                    {data.name.length < 100 ? data.name : data.name.slice(0, 100) + " ..."}
                  </Typography>
                  <Typography>
                    Last Checked:{" "}
                    {getFormattedDate(new Date(data.equipmentHistory[0]?.date as Date))}
                  </Typography>
                  <Typography>
                    Status:{" "}
                    <Typography
                      component="span"
                      sx={{
                        bgcolor: statusColorGenerator(data.equipmentHistory[0]?.status as string),
                        borderRadius: "5px",
                        color: "white",
                        width: "100px",
                        height: "15px",
                        py: 0.3,
                        px: 0.5,
                      }}
                    >
                      {data.equipmentHistory[0]?.status}
                    </Typography>
                  </Typography>
                </Stack>
              </>
            )}
            {sessionData && (
              <Stack
                justifyContent="center"
                sx={{
                  p: 1,
                  bgcolor: "grey.500",
                  heigth: "100%",
                }}
              >
                <ActionMaker
                  status="In inventory"
                  group="PITO"
                  direction="column"
                  id={data.id}
                  name={data.name}
                />
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
                  <KeyboardArrowRightIcon
                    sx={{
                      color: "white",
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  />
                </IconButton>
              </Link>
            )}
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default Scanner;
