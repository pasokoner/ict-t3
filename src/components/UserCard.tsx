import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

type Props = {
  name: string;
  image: string;
};



export default function UserCard({ name, image }: Props) {
  return (
    <Card sx={{ display: "flex", width: "250px", height: 70 }}>
      <CardMedia
        component="img"
        sx={{ width: 70, borderRadius: "50%", p: 1.5 }}
        image={`${image}`}
        alt="Live from space album cover"
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: "auto",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography fontSize={14} fontWeight="bold">
            {name}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
}
