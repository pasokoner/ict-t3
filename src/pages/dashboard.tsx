import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { getSession, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import { useEffect, useState } from "react";

import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import AddIcon from "@mui/icons-material/Add";

import {
  Button,
  Divider,
  Stack,
  Typography,
  Box,
  Popover,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import CollapsibleTable from "../components/Table";
import StatusSectionCard from "../components/StatusSectionCard";

import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import ConstructionIcon from "@mui/icons-material/Construction";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RemoveIcon from "@mui/icons-material/Remove";

import FilterListIcon from "@mui/icons-material/FilterList";

import useMediaQuery from "@mui/material/useMediaQuery";

import { conditions, departments } from "../utils/constant";

import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import ExportButton from "../components/ExportButton";

type FilterValues = {
  condition?: string;
  department?: string;
  serial?: string;
  unchecked: boolean;
};

const Dashboard: NextPage = () => {
  const { data: itemsData, isLoading } = trpc.equiptment.countByStatus.useQuery(
    {},
    { refetchOnWindowFocus: false }
  );

  const { data: sessionData } = useSession();

  const [filter, setFilter] = useState<{
    condition?: string;
    department?: string;
    serial?: string;
    status: string;
    unchecked: boolean;
  }>({
    status: sessionData?.user?.group === "PITO" ? "For repair" : "Condemned",
    unchecked: false,
  });

  const [serial, setSerial] = useState("");

  const [enableFilter, setEnableFilter] = useState(false);

  const matches = useMediaQuery("(max-width:900px)");

  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FilterValues>();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    const clearSearch = setTimeout(() => {
      setFilter((prevState) => {
        return { ...prevState, serial: serial };
      });
    }, 500);

    return () => {
      clearTimeout(clearSearch);
    };
  }, [serial]);

  if (isLoading) {
    return <></>;
  }

  const applyFilter: SubmitHandler<FilterValues> = async (data) => {
    console.log(data);
    setFilter((prevState) => {
      return { ...prevState, ...data };
    });
  };

  const setStatusFilter = (status: string) => {
    setFilter((prevState) => {
      return { ...prevState, status: status };
    });
  };

  console.log(filter);

  return (
    <Box>
      <Head>
        {sessionData?.user?.group === "PITO" && itemsData && (
          <title>
            ICT Inventory System {itemsData?.forRepair > 0 ? `(${itemsData?.forRepair})` : ""}
          </title>
        )}
        {sessionData?.user?.group === "GSO" && itemsData && (
          <title>
            ICT Inventory System {itemsData?.toCondemn > 0 ? `(${itemsData?.toCondemn})` : ""}
          </title>
        )}
        <meta property="og:title" content="ICT Inventory System" key="title" />
      </Head>
      <Stack>
        <Stack
          sx={{
            justifyContent: "space-between",
            flexDirection: "row",
            mb: 3,
            ...(matches && {
              flexDirection: "column",
              rowGap: 3,
            }),
          }}
        >
          <Stack direction="row" gap={2}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              DASHBOARD
            </Typography>

            <IconButton onClick={handleClick}>
              <QuestionMarkIcon />
            </IconButton>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Stack
                gap={1}
                sx={{
                  p: 2,
                  borderRadius: "5px",
                }}
              >
                <Typography>EQUIPMENT GUIDE</Typography>
                <Stack direction="row" gap={2}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      border: 2,
                    }}
                  ></Box>
                  <Typography variant="subtitle2">In PGSO inventory and In office</Typography>
                </Stack>

                <Stack direction="row" gap={2}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#fce063",
                      border: 2,
                    }}
                  ></Box>
                  <Typography variant="subtitle2">In PGSO inventory but not in office</Typography>
                </Stack>

                <Stack direction="row" gap={2}>
                  <Box
                    component="span"
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: "#f27b57",
                      border: 2,
                    }}
                  ></Box>
                  <Typography variant="subtitle2">
                    In office but not in inventory of PGSO
                  </Typography>
                </Stack>
              </Stack>
            </Popover>
          </Stack>

          <Stack direction="row" gap={1}>
            <ExportButton filter={filter} />
            {(sessionData?.user?.group === "GSO" || sessionData?.user?.group === "PITO") && (
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  router.push("/new-device");
                }}
                sx={{
                  whiteSpace: "nowrap",
                }}
              >
                New Device
              </Button>
            )}
          </Stack>
        </Stack>

        <Stack
          mb={1}
          direction="row"
          sx={{
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            rowGap: 2,
          }}
        >
          <StatusSectionCard
            count={itemsData?.inInventory}
            title="In inventory"
            icon={<InventoryIcon />}
            color="primary.main"
            setStatusFilter={setStatusFilter}
            statusFilter={filter.status}
          />

          <StatusSectionCard
            count={itemsData?.forRepair}
            title="For repair"
            icon={<BuildIcon />}
            color="info.main"
            setStatusFilter={setStatusFilter}
            statusFilter={filter.status}
          />

          <StatusSectionCard
            count={itemsData?.unserviceable}
            title="Unserviceable"
            icon={<ConstructionIcon />}
            color="grey.500"
            setStatusFilter={setStatusFilter}
            statusFilter={filter.status}
          />

          <StatusSectionCard
            count={itemsData?.toCondemn}
            title="To condemn"
            icon={<PendingActionsIcon />}
            color="warning.main"
            setStatusFilter={setStatusFilter}
            statusFilter={filter.status}
          />
          <StatusSectionCard
            count={itemsData?.condemned}
            title="Condemned"
            icon={<RemoveIcon />}
            color="error.main"
            setStatusFilter={setStatusFilter}
            statusFilter={filter.status}
          />
        </Stack>

        <Divider />
        <Stack direction="row" gap={1}>
          <TextField
            size="small"
            label="Search Serial Number"
            {...register("serial", {
              onChange: (e: React.FormEvent<HTMLInputElement>) => {
                setSerial(e.currentTarget.value);
              },
            })}
            sx={{
              flexGrow: 1,
            }}
          />
          <IconButton
            onClick={() => {
              setEnableFilter((prevState) => !prevState);
            }}
          >
            <FilterListIcon />
          </IconButton>
        </Stack>

        {enableFilter && (
          <Stack
            gap={2}
            component="form"
            onSubmit={handleSubmit(applyFilter)}
            sx={{
              p: 2,
              border: 1.5,
            }}
          >
            <Typography fontWeight="bold">Filter Equiptment</Typography>
            <Stack gap={0.5}>
              <Typography>Condition</Typography>
              <FormControl fullWidth>
                <Select
                  size="small"
                  variant="standard"
                  defaultValue={filter?.condition}
                  {...register("condition")}
                >
                  <MenuItem value="">None</MenuItem>
                  {conditions.map(({ value, name }, i) => (
                    <MenuItem key={i} value={value}>
                      <Box
                        component="span"
                        sx={{
                          width: 20,
                          height: 20,
                          border: 2,
                          mr: 1,
                          ml: 2,
                          backgroundColor:
                            value === "IIIO" ? "white" : value === "NIIO" ? "#f27b57" : "#fce063",
                        }}
                      ></Box>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack gap={0.5}>
              <Typography>Department</Typography>
              <FormControl fullWidth>
                <Select
                  size="small"
                  variant="standard"
                  defaultValue={filter?.department}
                  {...register("department")}
                >
                  <MenuItem value="">None</MenuItem>
                  {departments.map(({ acronym, name }, i) => (
                    <MenuItem key={i} value={acronym}>
                      {acronym} - {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <FormGroup>
              <FormControlLabel
                control={<Switch />}
                label="Unchecked Equipment"
                {...register("unchecked")}
              />
            </FormGroup>

            <Button variant="outlined" type="submit">
              Apply Filter
            </Button>
          </Stack>
        )}

        {itemsData && <CollapsibleTable filter={filter} countStatus={itemsData?.inInventory} />}
      </Stack>
    </Box>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!session?.user?.role && !session?.user?.group) {
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
