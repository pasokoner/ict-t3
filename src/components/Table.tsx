import { trpc } from "../utils/trpc";

import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

import {
  Backdrop,
  Button,
  useMediaQuery,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import QrMaker from "./QrMaker";
import ActionMaker from "./ActionMaker";

import { statusColorGenerator, getFormattedDate } from "../utils/constant";
import HistoryRow from "./HistoryRow";
import { useRouter } from "next/router";

type TableFormat = {
  id: string;
  name: string;
  department: string;
  lastChecked: Date;
  status: string;
  parts: boolean;
  serial: string;
  condition: string;
};

type EquiptmentHistory = {
  date: Date;
  handler: string;
  status: string;
  equiptmentId: string;
};

function createData(
  id: string,
  name: string,
  department: string,
  lastChecked: Date,
  status: string,
  parts: boolean,
  serial: string,
  condition: string
) {
  return {
    id,
    name,
    department,
    lastChecked,
    status,
    parts,
    serial,
    condition,
  };
}

type History = {
  date: Date;
  handler: string;
  status: string;
}[];

function Row(props: { row: ReturnType<typeof createData>; matches: boolean }) {
  const { row, matches } = props;
  const [open, setOpen] = useState(false);

  const { data: sessionData } = useSession();

  const router = useRouter();

  return (
    <>
      <TableRow
        sx={{
          bgcolor: `${
            row.parts
              ? "info.light"
              : row.condition === "IINO"
              ? "info.light"
              : row.condition === "NINO"
              ? "error.light"
              : ""
          }`,
          "& > *": { borderBottom: "unset", py: 0.1 },
          "& .MuiTableCell-root": {
            fontSize: { md: 16, xs: 14 },
          },
        }}
      >
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
                  router.push(`/equiptment/${row.id}`);
                }}
              >
                #{row.id.slice(0, 5) + "..."}
              </Button>
            </TableCell>
            <TableCell sx={{ minWidth: "120px" }}>{row.name}</TableCell>
            <TableCell sx={{ minWidth: "120px" }}>{row.department}</TableCell>
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
                {sessionData && (
                  <ActionMaker
                    direction="row"
                    status={row.status}
                    group={sessionData?.user?.group as string}
                    size="small"
                    id={row.id}
                    name={row.name}
                    isParts={row.parts}
                    serial={row.serial}
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
                  router.push(`/equiptment/${row.id}`);
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
                {sessionData && (
                  <ActionMaker
                    direction="row"
                    status={row.status}
                    group={sessionData?.user?.group as string}
                    size="small"
                    id={row.id}
                    name={row.name}
                    isParts={row.parts}
                    serial={row.serial}
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
            <HistoryRow equiptmentId={row.id} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

type TableProps = {
  tableFilter: string;
  countStatus?: number;
};

export default function CollapsibleTable({ tableFilter, countStatus }: TableProps) {
  const { data: equiptment, refetch } = trpc.equiptment.all.useQuery(
    { filter: tableFilter },
    { refetchOnWindowFocus: false }
  );

  const [formattedData, setFormattedData] = useState<TableFormat[]>();

  const matches = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    refetch();
  }, [countStatus, refetch]);

  useEffect(() => {
    if (equiptment && equiptment.length > 0) {
      const format = equiptment
        .filter((data) => data.status === tableFilter)
        .map((e) => {
          return createData(
            e.id,
            e.name,
            e.department as string,
            e.date,
            e.status,
            e.parts,
            e.serial,
            e.condition
          );
        });
      setFormattedData(format);
    } else {
      setFormattedData([]);
    }
  }, [equiptment, tableFilter]);

  return (
    <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {!matches && (
              <>
                <TableCell>Item ID</TableCell>
                <TableCell>Equiptment</TableCell>
                <TableCell>Department</TableCell>

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
              <Row key={row.serial} row={row} matches={matches} />
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
