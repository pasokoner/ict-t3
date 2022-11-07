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
import { Backdrop, Button, useMediaQuery } from "@mui/material";

import { statusColorGenerator, getFormattedDate } from "../utils/constant";
import QrMaker from "./QrMaker";
import ActionMaker from "./ActionMaker";
import { Stack } from "@mui/system";

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

function Row(props: { row: ReturnType<typeof createData>; matches: boolean }) {
  const { row, matches } = props;
  const [open, setOpen] = React.useState(false);
  const [showQr, setShowQr] = React.useState(false);

  const { data: userInfo } = trpc.auth.getUserInfo.useQuery();

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset", py: 0.2 } }}>
        {!matches && (
          <>
            <TableCell
              sx={{
                width: "50px",
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setShowQr(true);
                }}
              >
                #{row.id.slice(0, 5) + "..."}
              </Button>
            </TableCell>
            <TableCell sx={{ minWidth: "120px" }}>{row.name}</TableCell>
            <TableCell sx={{ minWidth: "120px" }}>{row.handler}</TableCell>
            <TableCell
              sx={{
                width: "125px",
              }}
            >
              {getFormattedDate(new Date(row.lastChecked))}
            </TableCell>
            <TableCell
              sx={{
                width: "125px",
              }}
            >
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
            <TableCell
              sx={{
                width: "125px",
              }}
            >
              <Stack direction="row">
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                {userInfo && (
                  <ActionMaker
                    direction="row"
                    status={row.status}
                    group={userInfo.group as string}
                    size="small"
                    id={row.id}
                  />
                )}
              </Stack>
            </TableCell>
          </>
        )}

        {matches && (
          <>
            <TableCell
              sx={{
                width: "50px",
              }}
            >
              <Button
                variant="text"
                onClick={() => {
                  setShowQr(true);
                }}
              >
                #{row.id.slice(0, 1) + "..."}
              </Button>
            </TableCell>

            <TableCell>
              <Typography noWrap> {row.name.slice(0, 30)}</Typography>
            </TableCell>

            <TableCell
              align="center"
              sx={{
                width: "50px",
              }}
            >
              {matches ? (
                <Box
                  sx={{
                    bgcolor: statusColorGenerator(row.status),
                    width: "45px",
                    height: "10px",
                    borderRadius: "5px",
                    color: "white",
                    // mr: "auto",
                  }}
                ></Box>
              ) : (
                <Typography
                  align="center"
                  noWrap
                  sx={{
                    bgcolor: statusColorGenerator(row.status),
                    borderRadius: "5px",
                    color: "white",
                    width: "100px",
                    ml: "auto",
                  }}
                >
                  {row.status}
                </Typography>
              )}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                width: "50px",
              }}
            >
              <Stack direction="row" justifyContent="center">
                <IconButton
                  aria-label="expand row"
                  size="small"
                  // sx={{
                  //   fontSize: 18,
                  // }}
                  onClick={() => setOpen(!open)}
                >
                  {open ? (
                    <KeyboardArrowUpIcon fontSize="inherit" />
                  ) : (
                    <KeyboardArrowDownIcon fontSize="inherit" />
                  )}
                </IconButton>
                {userInfo && (
                  <ActionMaker
                    direction="row"
                    status={row.status}
                    group={userInfo.group as string}
                    size="small"
                    id={row.id}
                  />
                )}
              </Stack>
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
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow, i) => (
                    <TableRow key={i}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          width: "100px",
                        }}
                      >
                        {getFormattedDate(new Date(historyRow.date))}
                      </TableCell>
                      <TableCell
                        sx={{
                          maxWidth: "150px",
                        }}
                      >
                        <Typography noWrap>{historyRow.handler}</Typography>
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
                              bgcolor: statusColorGenerator(historyRow.status),
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
                              bgcolor: statusColorGenerator(historyRow.status),
                              width: "100px",
                              borderRadius: "5px",
                              color: "white",
                              mr: "auto",
                            }}
                          >
                            {historyRow.status}
                          </Typography>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showQr}
        onClick={() => {
          setShowQr(false);
        }}
      >
        <Box
          sx={{
            maxWidth: { md: 400, xs: 185 },
          }}
        >
          {showQr && <QrMaker value={row.id} />}
        </Box>
      </Backdrop>
    </React.Fragment>
  );
}

type TableProps = {
  tableFilter: string;
};

export default function CollapsibleTable({ tableFilter }: TableProps) {
  const { data: tableData } = trpc.equiptment.all.useQuery();

  const [formattedData, setFormattedData] = React.useState<TableFormat[]>();

  const matches = useMediaQuery("(max-width:900px)");

  React.useEffect(() => {
    if (tableData) {
      const format = tableData
        .filter((data) => data.status === tableFilter)
        .map((e) => {
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
  }, [tableData, tableFilter]);

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
                <TableCell align="center">Item ID</TableCell>
                <TableCell>Equiptment</TableCell>
                <TableCell align="center">Status</TableCell>
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
