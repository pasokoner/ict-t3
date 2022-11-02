import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { trpc } from "../utils/trpc";
import { useMediaQuery } from "@mui/material";

type TableFormat = {
  id: string;
  name: string;
  handler: string;
  numOfTransactions: number;
  lastChecked: Date;
  status: string;
  history: {
    date: Date;
    handler: string;
    status: string;
  }[];
};

function createData(
  id: string,
  name: string,
  handler: string,
  numOfTransactions: number,
  lastChecked: Date,
  status: string,
  history: {
    date: Date;
    handler: string;
    status: string;
  }[]
) {
  return {
    id,
    name,
    handler,
    numOfTransactions,
    lastChecked,
    status,
    history,
  };
}

type History = {
  date: Date;
  handler: string;
  status: string;
}[];

const statusColorGenerator = (status: string) => {
  if (status === "In inventory") {
    return "success.main";
  }

  if (status === "For repair") {
    return "#e3d100";
  }

  if (status === "To condemn") {
    return "warning.main";
  }

  if (status === "Condemned") {
    return "error.main";
  }
};

const getFormattedDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return month + "/" + day + "/" + year;
};

function Row(props: { row: ReturnType<typeof createData>; matches: boolean }) {
  const { row, matches } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset", py: 1 } }}>
        {!matches && (
          <>
            <TableCell>
              <Typography
                fontWeight="bold"
                sx={{
                  color: "#00b3ff",

                  "&:hover": {
                    cursor: "pointer",
                    color: "#55ccff",
                  },
                }}
              >
                #{row.id.slice(0, 5) + "..."}
              </Typography>
            </TableCell>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.handler}</TableCell>
            <TableCell>{new Date(row.lastChecked).toDateString()}</TableCell>
            <TableCell>
              <Typography
                align="center"
                noWrap
                sx={{
                  bgcolor: statusColorGenerator(row.status),
                  width: "100px",
                  borderRadius: "5px",
                  color: "white",
                  mr: "auto",
                }}
              >
                {row.status}
              </Typography>
            </TableCell>
            <TableCell>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          </>
        )}

        {matches && (
          <>
            <TableCell
              sx={{
                maxWidth: "150px",
              }}
            >
              <Typography noWrap> {row.name.slice(0, 30)}</Typography>
            </TableCell>

            <TableCell>
              {matches ? (
                <Box
                  sx={{
                    bgcolor: statusColorGenerator(row.status),
                    width: "45px",
                    height: "10px",
                    borderRadius: "5px",
                    color: "white",
                    mr: "auto",
                  }}
                ></Box>
              ) : (
                <Typography
                  align="center"
                  noWrap
                  sx={{
                    bgcolor: statusColorGenerator(row.status),
                    width: "100px",
                    borderRadius: "5px",
                    color: "white",
                    ml: "auto",
                  }}
                >
                  {row.status}
                </Typography>
              )}
            </TableCell>
            <TableCell align="center">
              <IconButton
                aria-label="expand row"
                size="small"
                sx={{
                  fontSize: 18,
                }}
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  <KeyboardArrowUpIcon fontSize="inherit" />
                ) : (
                  <KeyboardArrowDownIcon fontSize="inherit" />
                )}
              </IconButton>
            </TableCell>
          </>
        )}
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={6}
          sx={{
            borderLeft: 1,
          }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: matches ? 0 : 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Handler</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {getFormattedDate(new Date(historyRow.date))}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "150px",
                        }}
                      >
                        <Typography noWrap>{historyRow.handler}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        {matches ? (
                          <Box
                            sx={{
                              bgcolor: statusColorGenerator(historyRow.status),
                              width: "45px",
                              height: "10px",
                              borderRadius: "5px",
                              color: "white",
                              mr: "auto",
                            }}
                          ></Box>
                        ) : (
                          <Typography
                            align="center"
                            noWrap
                            sx={{
                              bgcolor: statusColorGenerator(historyRow.status),
                              width: "100px",
                              borderRadius: "5px",
                              color: "white",
                              mr: "auto",
                            }}
                          >
                            {historyRow.status}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable() {
  const { data } = trpc.equiptment.all.useQuery();
  const [formattedData, setFormattedData] = React.useState<TableFormat[]>();

  const matches = useMediaQuery("(max-width:900px)");

  React.useEffect(() => {
    if (data) {
      const format = data.map((e) => {
        return createData(
          e.id,
          e.name,
          e.handler as string,
          e.numOfTransactions.equipmentHistory,
          e.lastChecked as Date,
          e.status as string,
          e.history as History
        );
      });
      setFormattedData(format);
    }
  }, [data]);

  return (
    <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {!matches && (
              <>
                <TableCell>Item ID</TableCell>
                <TableCell>Equiptment</TableCell>
                <TableCell>Handler</TableCell>

                <TableCell>Last checked</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </>
            )}
            {matches && (
              <>
                <TableCell>Equiptment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {formattedData &&
            formattedData.map((row: ReturnType<typeof createData>) => (
              <Row key={row.id} row={row} matches={matches} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
