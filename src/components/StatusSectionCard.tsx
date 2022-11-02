import React from "react";

import { Stack, Typography, Paper } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

type Props = {
  icon: JSX.Element;
  color: string;
  title: string;
  count: number;
};

const StatusSectionCard = ({ icon, title, count, color }: Props) => {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <Paper
      sx={{
        // maxWidth: "250px",
        width: { m: "100%", xs: "45%" },
        height: "90px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        p: { md: 2, sm: 2, xs: 1 },
        "&:hover": { bgcolor: "grey.200", cursor: "pointer" },
        "& .MuiSvgIcon-root": {
          fontSize: 50,
          bgcolor: color,
          color: "white",
          borderRadius: "10px",
          p: 1,
        },

        ...(matches && {
          height: "80px",
          "& .MuiSvgIcon-root": {
            fontSize: 35,
            bgcolor: color,
            color: "white",
            borderRadius: "10px",
            p: 1,
          },
        }),
      }}
    >
      {!matches && (
        <>
          {icon}

          <Stack>
            <Typography
              fontWeight="bold"
              fontSize={24}
              sx={{
                color: "primary.main",
              }}
            >
              {count}
            </Typography>

            <Typography
              fontSize={12}
              noWrap
              sx={{
                color: "primary.light",
              }}
            >
              {title}
            </Typography>
          </Stack>
        </>
      )}

      {matches && (
        <Stack
          direction="column"
          gap={0.5}
          sx={{
            width: "100%",
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-around",
            }}
          >
            {icon}

            <Stack>
              <Typography
                fontWeight="bold"
                fontSize={24}
                sx={{
                  color: "primary.main",
                }}
              >
                {count}
              </Typography>
            </Stack>
          </Stack>
          <Typography
            fontSize={12}
            noWrap
            align="center"
            sx={{
              color: "primary.light",
            }}
          >
            {title}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default StatusSectionCard;
