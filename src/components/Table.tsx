import { trpc } from "../utils/trpc";

import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

import {
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
  TextField,
  Typography,
  Stack,
  Popover,
  ButtonGroup,
  LinearProgress,
  Link as MuiLink,
  Pagination,
  TablePagination,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import ActionMaker from "./ActionMaker";

import { statusColorGenerator, getFormattedDate } from "../utils/constant";
import HistoryRow from "./HistoryRow";
import { useRouter } from "next/router";
import { useQrCart } from "../context/QrCartContext";
import Link from "next/link";

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

function Row(props: { row: ReturnType<typeof createData>; matches: boolean }) {
  const { row, matches } = props;
  const [open, setOpen] = useState(false);

  const { data: sessionData } = useSession();

  const { increaseCartQuantity } = useQrCart();

  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openPop = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <TableRow
        sx={{
          bgcolor: `${
            row.parts
              ? "info.light"
              : row.condition === "IINO"
              ? "info.main"
              : row.condition === "NIIO"
              ? "error.light"
              : ""
          }`,

          "& > *": { borderBottom: "unset" },
          "& .MuiTableCell-root": {
            fontSize: { md: 16, xs: 14 },
            py: 0.3,
            color: `${row.condition !== "IIIO" ? "white" : "black"}`,
            textShadow: `${row.condition !== "IIIO" ? "1px 1px 4px black" : ""}`,
          },
          "& .MuiButton-root": {
            color: `${row.condition !== "IIIO" ? "white" : "black"}`,
            border: row.condition !== "IIIO" ? 2 : 0,
            textShadow: `${row.condition !== "IIIO" ? "1px 1px 4px black" : ""}`,
          },

          "& .MuiTypography-root": {
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
              <Button variant="text" onClick={handleClick}>
                #{row.id.slice(0, 5) + "..."}
              </Button>
              <Popover
                id={id}
                open={openPop}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Stack
                  gap={0.5}
                  sx={{
                    p: 1,
                    borderRadius: "5px",
                  }}
                >
                  <Link href={`/equiptment/${row.id}`} passHref>
                    <MuiLink
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        m: "0 auto",
                      }}
                    >
                      View Details
                    </MuiLink>
                  </Link>

                  <Button
                    onClick={() => {
                      increaseCartQuantity(row.id, row.department);
                    }}
                  >
                    PRINT QR
                  </Button>
                </Stack>
              </Popover>
            </TableCell>
            <TableCell>
              {row.name.length >= 45 && (
                <Typography noWrap> {row.name.slice(0, 45) + "..."}</Typography>
              )}
              {row.name.length < 45 && <Typography noWrap> {row.name}</Typography>}
            </TableCell>
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
              <Stack
                direction="row"
                sx={{
                  border: row.condition !== "IIIO" ? 2 : 0,
                  borderColor: row.condition !== "IIIO" ? "black" : "",
                  bgcolor: row.condition !== "IIIO" ? "white" : "",
                }}
              >
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
                    lastChecked={row.lastChecked}
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
                px: 0.3,
              }}
            >
              <Button
                variant="text"
                onClick={handleClick}
                sx={{
                  p: 0,
                }}
              >
                #{row.id.slice(0, 1) + "..."}
              </Button>

              <Popover
                id={id}
                open={openPop}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Stack
                  gap={0.5}
                  sx={{
                    p: 1,
                    borderRadius: "5px",
                  }}
                >
                  <Link href={`/equiptment/${row.id}`} passHref>
                    <MuiLink
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        m: "0 auto",
                      }}
                    >
                      View Details
                    </MuiLink>
                  </Link>

                  <Button
                    onClick={() => {
                      increaseCartQuantity(row.id, row.department);
                    }}
                  >
                    PRINT QR
                  </Button>
                </Stack>
              </Popover>
            </TableCell>

            <TableCell>
              {row.name.length >= 15 && (
                <Typography noWrap> {row.name.slice(0, 15) + "..."}</Typography>
              )}
              {row.name.length < 15 && <Typography noWrap> {row.name}</Typography>}
            </TableCell>

            <TableCell
              align="center"
              sx={{
                width: "50px",
                px: 0,
              }}
            >
              <Stack
                direction="row"
                justifyContent="center"
                sx={{
                  border: row.condition !== "IIIO" ? 2 : 0,
                  borderColor: row.condition !== "IIIO" ? "black" : "",
                  bgcolor: row.condition !== "IIIO" ? "white" : "",
                  px: 0,
                  maxWidth: "50px",
                }}
              >
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
                    lastChecked={row.lastChecked}
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
  filter: {
    status: string;
    condition?: string;
    department?: string;
    serial?: string;
  };
  countStatus?: number;
};

export default function CollapsibleTable({ filter, countStatus }: TableProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {
    data: equiptment,
    refetch,
    isLoading,
  } = trpc.equiptment.all.useQuery(
    {
      status: filter.status,
      condition: filter.condition ? filter.condition : undefined,
      department: filter.department ? filter.department : undefined,
      serial: filter.serial ? filter.serial : undefined,
    },
    { refetchOnWindowFocus: false }
  );

  const [formattedData, setFormattedData] = useState<TableFormat[]>();

  const matches = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    refetch();
  }, [countStatus, refetch]);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  useEffect(() => {
    if (equiptment && equiptment.length > 0) {
      const format = equiptment
        .filter((data) => data.status === filter.status)
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
        })
        .slice(page * rowsPerPage, page === 0 ? rowsPerPage : rowsPerPage * (page + 1));
      setFormattedData(format);
    } else {
      setFormattedData([]);
    }
  }, [equiptment, filter, page, rowsPerPage]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
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
      {isLoading && <LinearProgress />}
      {/* {!isLoading && (
        <Button
          variant="outlined"
          onClick={() => {
            setItemsLoaded((prevState) => prevState + 15);
          }}
          sx={{
            mt: 2,
          }}
        >
          Load 20 more+
        </Button>
      )} */}

      {equiptment?.length === 0 && (
        <Typography mt={2} align="center" color="error">
          No Equiptment found!
        </Typography>
      )}
      <TablePagination
        component="div"
        count={equiptment?.length ? equiptment.length : 0}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
