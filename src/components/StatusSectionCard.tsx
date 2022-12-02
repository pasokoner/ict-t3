import { Stack, Typography, Paper, Button, useMediaQuery } from "@mui/material";

type Props = {
  icon: JSX.Element;
  color: string;
  title: string;
  count: number | undefined;
  setStatusFilter: (status: string) => void;
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: "190px",
        gap: 2,
        py: 1,
        px: 2,
        bgcolor: statusFilter === title ? "grey.200" : "white",
        "&:hover": { bgcolor: "grey.200", cursor: "pointer" },
        "& .MuiSvgIcon-root": {
          fontSize: 40,
          bgcolor: color,
          color: "white",
          borderRadius: "5px",
          p: 1,
        },

        ...(matches && {
          "& .MuiSvgIcon-root": {
            fontSize: 30,
            bgcolor: color,
            color: "white",
            borderRadius: "5px",
            p: 0.7,
          },
          minWidth: "none",
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
                color: "primary.dark",
              }}
            >
              {count}
            </Typography>

            <Typography
              fontSize={12}
              noWrap
              sx={{
                color: "primary.main",
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
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {icon}

          <Typography
            fontWeight="bold"
            fontSize={15}
            sx={{
              color: "primary.main",
            }}
          >
            {count && count > 9999 ? "9999+" : count}
          </Typography>
        </Stack>
      )}
    </Paper>
  );
};

export default StatusSectionCard;
