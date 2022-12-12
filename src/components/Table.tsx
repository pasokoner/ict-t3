import { trpc } from "../utils/trpc";

import { useSession } from "next-auth/react";

import { useState, useEffect } from "react";

import {
  Button,
  useMediaQuery,
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
  Popover,
  LinearProgress,
  Link as MuiLink,
  TablePagination,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import ActionMaker from "./ActionMaker";

import { statusColorGenerator, getFormattedDate } from "../utils/constant";
import HistoryRow from "./HistoryRow";

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
  condition: string,
  currentUser: string
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
    currentUser,
  };
}

function Row(props: { row: ReturnType<typeof createData>; matches: boolean }) {
  const { row, matches } = props;
  const [open, setOpen] = useState(false);

  const { data: sessionData } = useSession();

  const { increaseCartQuantity } = useQrCart();

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
          "& > *": { borderBottom: "unset" },
          "& .MuiTableCell-root": {
            fontSize: { md: 16, xs: 14 },
            py: 1,
          },

          "& .MuiTypography-root": {
            fontSize: { md: 16, xs: 14 },
          },
        }}
      >
        {!matches && (
          <>
            <TableCell sx={{ width: "50px" }}>
              <Button
                variant="text"
                onClick={handleClick}
                fullWidth
                sx={{
                  color: `${row.condition === "NIIO" ? "white" : "black"}`,
                  border: 2,
                  borderColor: "black",
                  p: 1,
                  bgcolor: `${
                    row.parts
                      ? "info.light"
                      : row.condition === "IINO"
                      ? "#fff700"
                      : row.condition === "NIIO"
                      ? "#ff5959"
                      : ""
                  }`,

                  "&:hover": {
                    color: `${row.condition === "NIIO" ? "white" : "black"}`,
                    bgcolor: `${
                      row.parts
                        ? "info.light"
                        : row.condition === "IINO"
                        ? "#eee700"
                        : row.condition === "NIIO"
                        ? "#ff7373"
                        : ""
                    }`,
                  },
                }}
              >
                {row.id.slice(-5)}
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

                  <Typography>SN: {row.serial}</Typography>
                  <Typography>USER: {row.currentUser ? row.currentUser : "N/A"}</Typography>
                </Stack>
              </Popover>
            </TableCell>
            <TableCell>
              {open && <Typography>{row.name}</Typography>}
              {!open && row.name.length >= 75 && (
                <Typography> {row.name.slice(0, 75) + "..."}</Typography>
              )}
              {!open && row.name.length < 75 && <Typography> {row.name}</Typography>}
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
                  p: 1,
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
                width: "50px",
              }}
            >
              <Button
                variant="text"
                onClick={handleClick}
                fullWidth
                sx={{
                  color: `${row.condition === "NIIO" ? "white" : "black"}`,
                  border: 2,
                  borderColor: "black",
                  p: 1,
                  bgcolor: `${
                    row.parts
                      ? "info.light"
                      : row.condition === "IINO"
                      ? "#fff700"
                      : row.condition === "NIIO"
                      ? "#ff5959"
                      : ""
                  }`,

                  "&:hover": {
                    color: `${row.condition === "NIIO" ? "white" : "black"}`,
                    bgcolor: `${
                      row.parts
                        ? "info.light"
                        : row.condition === "IINO"
                        ? "#eee700"
                        : row.condition === "NIIO"
                        ? "#ff7373"
                        : ""
                    }`,
                  },
                }}
              >
                {row.id.slice(-5)}
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

                  <Typography>SN: {row.serial}</Typography>
                </Stack>
              </Popover>
            </TableCell>

            <TableCell>
              {open && <Typography>{row.name}</Typography>}
              {!open && row.name.length >= 15 && (
                <Typography noWrap> {row.name.slice(0, 15) + "..."}</Typography>
              )}
              {!open && row.name.length < 15 && <Typography noWrap> {row.name}</Typography>}
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

  const { increaseCartQuantity, emptyCart } = useQrCart();

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

  const { data: sessionData } = useSession();

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
            e.condition,
            e.currentUser
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

  const addAllToCart = () => {
    equiptment?.forEach(({ id, department }) => {
      increaseCartQuantity(id, department);
    });
  };

  return (
    <>
      {sessionData?.user?.role === "SUPERADMIN" && (
        <>
          <Button
            onClick={() => {
              addAllToCart();
            }}
          >
            Add all to cart
          </Button>
          <Button
            onClick={() => {
              emptyCart();
            }}
          >
            empty cart
          </Button>
        </>
      )}
      <TableContainer
        sx={{
          "& .MuiTableHead-root": {
            bgcolor: "#f4f4f4",
          },
        }}
      >
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
                  <TableCell>Item ID</TableCell>
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
        sx={{
          ...(matches && {
            margin: "0 auto",
          }),
        }}
      />
    </>
  );
}
