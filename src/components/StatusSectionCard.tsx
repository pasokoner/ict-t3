import React from "react";

import { Stack, Typography, Paper } from "@mui/material";

type Props = {
  icon: JSX.Element;
  color: string;
  title: string;
  count: number;
};

const StatusSectionCard = ({ icon, title, count, color }: Props) => {
  return (
    <Paper
      elevation={1}
      sx={{
        maxWidth: "300px",
        width: "100%",
        height: "90px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        p: 2,

        "&:hover": { bgcolor: "grey.200", cursor: "pointer" },

        "& .MuiSvgIcon-root": {
          fontSize: 50,
          bgcolor: color,
          color: "white",
          borderRadius: "10px",
          p: 1,
        },
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
    </Paper>
  );
};

export default StatusSectionCard;
