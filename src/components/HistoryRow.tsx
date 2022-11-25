import React from "react";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  useMediaQuery,
} from "@mui/material";

import { getFormattedDate, statusColorGenerator } from "../utils/constant";
import { trpc } from "../utils/trpc";

type Props = {
  equiptmentId: string;
};

const HistoryRow = (props: Props) => {
  const { equiptmentId } = props;

  const { data, isLoading } = trpc.equiptment.getHistory.useQuery({
    equiptmentId: equiptmentId,
  });

  const matches = useMediaQuery("(max-width:900px)");

  if (isLoading) {
    return <></>;
  }

  return (
    <Box sx={{ margin: matches ? 0 : 1 }}>
      <Typography variant="h6" gutterBottom component="div">
        History
      </Typography>
      <Table size="small" aria-label="purchases">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Handler</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map(({ id, date, status, user }) => (
              <TableRow
                key={id}
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: { md: 16, xs: 14 },
                  },
                }}
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    width: "100px",
                  }}
                >
                  {getFormattedDate(new Date(date))}
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: "150px",
                  }}
                >
                  <Typography noWrap>{user.name as string}</Typography>
                </TableCell>

                {matches ? (
                  <TableCell
                    align="center"
                    sx={{
                      width: "50px",
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: statusColorGenerator(status),
                        width: "45px",
                        height: "10px",
                        borderRadius: "5px",
                        color: "white",
                        mr: "auto",
                      }}
                    ></Box>
                  </TableCell>
                ) : (
                  <TableCell
                    align="center"
                    sx={{
                      width: "125px",
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        bgcolor: statusColorGenerator(status),
                        width: "100px",
                        borderRadius: "5px",
                        color: "white",
                        mr: "auto",
                      }}
                    >
                      {status}
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default HistoryRow;
