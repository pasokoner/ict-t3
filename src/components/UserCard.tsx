import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { red } from "@mui/material/colors";

import PersonOffIcon from "@mui/icons-material/PersonOff";

type Props = {
  name: string;
  image: string;
  enableRemove: boolean;
};

export default function UserCard({ name, image, enableRemove }: Props) {
  return (
    <Stack direction="row" alignItems="center">
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
      {enableRemove && (
        <IconButton
          aria-label="delete"
          sx={{
            color: red[300],
          }}
        >
          <PersonOffIcon />
        </IconButton>
      )}
    </Stack>
  );
}
