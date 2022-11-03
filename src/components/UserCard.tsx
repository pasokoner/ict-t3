import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";
import { trpc } from "../utils/trpc";

export default function UserCard() {
  const { data } = trpc.auth.getUserInfo.useQuery();

  return (
    <Card sx={{ display: "flex", width: "270px", height: "100px" }}>
      <CardMedia
        component="img"
        sx={{ width: 100, borderRadius: "50%", p: 2 }}
        image={`${data?.image}`}
        alt="Live from space album cover"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" fontSize={18} fontWeight="bold" noWrap>
            {data?.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" fontSize={13}>
            {data?.group}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" fontWeight="medium" fontSize={15}>
            {data?.role}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
