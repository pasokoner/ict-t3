import { GetServerSideProps } from "next";

import { useSession, getSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import { useState } from "react";

import {
  Typography,
  Stack,
  IconButton,
  ButtonGroup,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
  LinearProgress,
} from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useForm, SubmitHandler } from "react-hook-form";

import QrMaker from "../components/QrMaker";
import { departments } from "../utils/constant";
import ImportButton from "../components/ImportButton";

type FormValues = {
  name: string;
  serial: string;
  department: string;
  issuedTo: string;
  usedBy: string;
  reminder: string;
  currentUser: string;
};

type Parts = {
  partsName: string;
  partsSerial: string;
};

const NewDevice = () => {
  const { mutate, isLoading, isSuccess, data } = trpc.equiptment.add.useMutation({
    onSuccess: () => {
      reset();
    },
  });

  const { data: sessionData } = useSession();

  const [value, setValue] = useState<Dayjs | null>(null);

  const [parts, setParts] = useState<Parts[]>([]);

  const [partsName, setPartsName] = useState("");
  const [partsSerial, setPartsSerial] = useState("");

  const [addParts, setAddParts] = useState(false);

  const [showCode, setShowCode] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);

    if (value) {
      if (parts.length > 0) {
        mutate({
          equiptment: { ...data, status: "In inventory", date: value.toDate() },
          parts: parts,
        });
      } else {
        mutate({
          equiptment: { ...data, status: "In inventory", date: value.toDate() },
        });
      }
    } else {
      if (parts.length > 0) {
        mutate({
          equiptment: { ...data, status: "In inventory" },
          parts: parts,
        });
      } else {
        mutate({
          equiptment: { ...data, status: "In inventory" },
        });
      }
    }
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const handleClose = () => {
    setAddParts(false);
  };

  const handleOpen = () => {
    setAddParts(true);
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      gap={3}
      sx={{
        width: { md: "50vw", xs: "80vw" },
        m: "0 auto",
        bgcolor: "white",
        color: "primary.main",
      }}
    >
      <Typography variant="h4" fontWeight="bold">
        Add new equiptment
      </Typography>

      {sessionData?.user?.role === "SUPERADMIN" && <ImportButton />}

      <Stack direction="column" gap={2}>
        <Typography
          p={1}
          px={2}
          fontSize={18}
          borderRadius={1}
          sx={{
            bgcolor: "primary.light",
            color: "white",
          }}
        >
          Equiptment details
        </Typography>

        <TextField
          id="outlined-basic"
          label="Enter Equipment Name"
          size="small"
          variant="outlined"
          required
          {...register("name")}
        />

        <TextField
          id="outlined-basic"
          label="Enter Serial Number"
          size="small"
          variant="outlined"
          required
          {...register("serial")}
        />

        <TextField
          id="outlined-basic"
          variant="outlined"
          label="Description"
          {...register("reminder")}
          multiline
          rows={6}
        ></TextField>
        <Typography
          p={1}
          px={2}
          fontSize={18}
          borderRadius={1}
          sx={{
            bgcolor: "primary.light",
            color: "white",
          }}
        >
          Unit parts (If unit is a set)
        </Typography>

        {parts.length > 0 && (
          <Stack direction="row" gap={2}>
            <Typography
              fontWeight="medium"
              sx={{
                width: "55%",
              }}
            >
              name
            </Typography>
            <Typography fontWeight="medium">serial</Typography>
          </Stack>
        )}
        {parts.length > 0 &&
          parts.map(({ partsName, partsSerial }, i) => (
            <Stack key={i} direction="row" gap={2}>
              <Typography
                sx={{
                  width: "55%",
                }}
              >
                {partsName}
              </Typography>
              <Typography> {partsSerial}</Typography>
            </Stack>
          ))}

        {addParts && (
          <Stack direction="row" justifyContent="space-between" gap={3}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="name"
              size="small"
              fullWidth
              value={partsName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPartsName(e.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              variant="outlined"
              label="serial number"
              size="small"
              fullWidth
              value={partsSerial}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPartsSerial(e.target.value);
              }}
            />
          </Stack>
        )}

        {addParts && (
          <Stack direction="row" justifyContent="center" gap={3}>
            <Button color="error" variant="contained" onClick={handleClose}>
              cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (partsName.trim() && partsSerial.trim()) {
                  setParts((prevState) => [
                    ...prevState,
                    { partsName: partsName.trim(), partsSerial: partsSerial.trim() },
                  ]);
                  setPartsName("");
                  setPartsSerial("");
                }
              }}
            >
              add part
            </Button>
          </Stack>
        )}
        {!addParts && (
          <Button variant="outlined" onClick={handleOpen}>
            +
          </Button>
        )}

        <Typography
          p={1}
          px={2}
          fontSize={18}
          borderRadius={1}
          sx={{
            bgcolor: "primary.light",
            color: "white",
          }}
        >
          Issuance details
        </Typography>

        <Stack direction="row" justifyContent="space-between" gap={3}>
          <TextField
            variant="outlined"
            label="Issued to:"
            size="small"
            fullWidth
            {...register("issuedTo")}
          />

          <TextField
            variant="outlined"
            label="Used by:"
            size="small"
            fullWidth
            required
            {...register("usedBy")}
          />
        </Stack>

        <TextField
          variant="outlined"
          label="Current User:"
          size="small"
          fullWidth
          {...register("currentUser")}
        />

        <Stack direction="row" gap={3}>
          <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">Department</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Department"
              {...register("department")}
            >
              {departments.map(({ acronym, name }, i) => (
                <MenuItem key={i} value={acronym}>
                  {acronym} - {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Date ( leave empty if same date )"
              inputFormat="MM/DD/YYYY"
              value={value}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} sx={{ alignSelf: "flex-end" }} fullWidth />
              )}
            />
          </LocalizationProvider>
        </Stack>
      </Stack>

      <Stack gap={2}>
        {isSuccess && (
          <Stack
            direction="row"
            gap={3}
            sx={{
              alignItems: "center",
            }}
          >
            <Typography>QR CODE GENERATED: </Typography>
            <Button
              variant="contained"
              size="small"
              endIcon={showCode ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              onClick={() => {
                setShowCode((prevState) => !prevState);
              }}
              sx={{
                maxWidth: "200px",
              }}
            >
              SHOW CODE
            </Button>
          </Stack>
        )}
        {isSuccess && showCode && data && (
          <Box
            sx={{
              m: "0 auto",
              maxWidth: 180,
            }}
          >
            <QrMaker value={data.id} />
          </Box>
        )}

        {isLoading && (
          <>
            <LinearProgress />
            <Button variant="outlined" disabled>
              Processing request
            </Button>
          </>
        )}

        {/* {isError && <Typography color="error">{JSON.parse(error.message)[0].message}</Typography>} */}
        {!isLoading && (
          <Button variant="contained" type="submit">
            Submit
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default NewDevice;

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

  // if (session.user.group !== "GSO") {
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
};
