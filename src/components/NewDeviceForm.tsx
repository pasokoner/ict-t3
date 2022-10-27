import React from "react";

import {
  Typography,
  Stack,
  IconButton,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  SelectChangeEvent,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../utils/trpc";
import QrMaker from "./QrMaker";
import { useSession } from "next-auth/react";

type FormValues = {
  equiptmentName: string;
  equiptmentStatus: "In inventory" | "For repair" | "To Condemn" | "Condemned";
  date: string;

  reminder: string;
};

type Props = {
  handleClose: () => void;
};

const NewDeviceForm = ({ handleClose }: Props) => {
  const { mutate, isLoading, isSuccess, data } = trpc.equiptment.add.useMutation({
    onSuccess: () => {
      reset();
    },
  });

  const { data: sessionData } = useSession();

  const [value, setValue] = React.useState<Dayjs | null>(null);

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const [showCode, setShowCode] = React.useState(false);
  const [age, setAge] = React.useState("");
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    // mutate({ name: data.equiptmentName.trim(), status: data.equiptmentStatus.trim() });

    if (value) {
      mutate({
        name: data.equiptmentName,
        status: data.equiptmentStatus,
        reminder: data.reminder,
        date: value.toDate(),
      });
    } else {
      mutate({ name: data.equiptmentName, status: data.equiptmentStatus, reminder: data.reminder });
    }
  };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        minHeight: "80vh",
        minWidth: { md: "50%", xs: "80%" },
        bgcolor: "white",
        color: "primary.main",
        p: 3,
        borderRadius: 2,
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h4">New Device</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon color="primary" />
        </IconButton>
      </Stack>

      <Stack direction="column" gap={2}>
        <TextField
          id="outlined-basic"
          label="Equipment"
          variant="outlined"
          {...register("equiptmentName", { required: true })}
        />
        {errors.equiptmentName && errors.equiptmentName.type === "required" && (
          <Typography color="error" variant="subtitle2">
            This is required
          </Typography>
        )}

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Equiptment Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Equiptment Status"
            {...register("equiptmentStatus", { onChange: handleChange, required: true })}
          >
            <MenuItem value={"In inventory"}>In Inventory</MenuItem>
            <MenuItem value={"For repair"}>For Repair</MenuItem>
            <MenuItem value={"To condemn"}>To Condemn</MenuItem>
            <MenuItem value={"Condemned"}>Condemned</MenuItem>
          </Select>
        </FormControl>
        {errors.equiptmentStatus && errors.equiptmentStatus.type === "required" && (
          <Typography color="error" variant="subtitle2">
            This is required
          </Typography>
        )}

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Date ( leave empty if same date )"
            inputFormat="MM/DD/YYYY"
            value={value}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField {...params} sx={{ minWidth: 200, alignSelf: "flex-end" }} fullWidth />
            )}
          />
        </LocalizationProvider>

        <TextField
          id="outlined-basic"
          variant="outlined"
          label={"Handler: " + `${sessionData && sessionData.user?.name}`}
          disabled
          value={sessionData && sessionData.user?.id}
        ></TextField>

        <TextField
          id="outlined-basic"
          variant="outlined"
          label="Reminder"
          {...register("reminder")}
          multiline
          rows={6}
        ></TextField>
      </Stack>

      <Stack mt="auto" gap={2}>
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
        {isSuccess && showCode && data && <QrMaker value={data.id} />}

        {isLoading && (
          <Button variant="outlined" disabled>
            Processing request
          </Button>
        )}

        {/* {isError && <Typography color="error">{JSON.parse(error.message)[0].message}</Typography>} */}
        {!isLoading && (
          <Button variant="outlined" type="submit">
            Submit
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default NewDeviceForm;
