import React from "react";

import { Stack, Typography, Paper, Button } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

type Props = {
  icon: JSX.Element;
  color: string;
  title: string;
  count: number | undefined;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
};

const StatusSectionCard = ({ icon, title, count, color, setStatusFilter, statusFilter }: Props) => {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <Paper
      component={Button}
      onClick={() => setStatusFilter(title)}
      disableRipple
      sx={{
        // maxWidth: "250px",
        width: { md: "100%", xs: "45%" },
        height: { md: "90px", sm: "70px" },
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        p: { md: 2, sm: 2, xs: 1 },
        bgcolor: statusFilter === title ? "grey.200" : "white",
        "&:hover": { bgcolor: "grey.200", cursor: "pointer" },
        "& .MuiSvgIcon-root": {
          fontSize: 50,
          bgcolor: color,
          color: "white",
          borderRadius: "10px",
          p: 1,
        },

        ...(matches && {
          height: "50px",
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
          direction="row"
          gap={1}
          sx={{
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Typography
            component="span"
            fontSize={11}
            sx={{
              bgcolor: `${color}`,
              borderRadius: "5px",
              color: "white",
              width: "85px",
              p: 0.5,
            }}
          >
            {title}
          </Typography>

          <Typography
            fontWeight="bold"
            fontSize={20}
            sx={{
              color: "primary.main",
            }}
          >
            {count}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default StatusSectionCard;
