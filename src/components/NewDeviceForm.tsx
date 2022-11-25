import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { useEffect } from "react";

import { trpc } from "../utils/trpc";

import { useState } from "react";

import {
  Typography,
  Stack,
  IconButton,
  Button,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useForm, SubmitHandler } from "react-hook-form";
import RepairForm from "./action-form/RepairForm";

type FormValues = {
  date: string;
  reminder: string;
};

type Props = {
  handleClose: () => void;
  status: string;
  equiptment?: string;
  equiptmentId: string;
  handleRefetch?: () => void;
};

const NewDeviceForm = ({ handleClose, status, equiptment, equiptmentId, handleRefetch }: Props) => {
  const { mutate: updateEquiptment, isLoading } = trpc.equiptment.update.useMutation({
    onSuccess: () => {
      handleClose();
    },
  });

  const { data: partsData, isLoading: partsLoading } = trpc.equiptment.getParts.useQuery({
    equiptmentId: equiptmentId,
  });

  const [value, setValue] = useState<Dayjs | null>(null);

  const [partsValue, setPartsValue] = useState<{ id: string; status: string }[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (value) {
      updateEquiptment({
        status: status,
        id: equiptmentId,
        reminder: data.reminder,
        date: value.toDate(),
      });
      router.reload();
    } else {
      updateEquiptment({ status: status, id: equiptmentId, reminder: data.reminder });
    }
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  let child: React.ReactNode;

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      gap={1}
      sx={{
        width: { md: "60vw", xs: "80vw" },
        bgcolor: "white",
        color: "primary.main",
        p: 3,
        borderRadius: 2,

        position: "fixed",
        top: "60%",
        left: "50%",
        transform: "translate(-50%, -60%)",
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h5">
          {status === "For repair" && "Sending for repair"}
          {status === "In inventory" && "Sending back to inventory"}
          {status === "To condemn" && "Sending for condemnation"}{" "}
          <Typography
            component="span"
            variant="h5"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 1,
              borderRadius: "5px",
            }}
          >
            {equiptment}
          </Typography>
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon color="primary" />
        </IconButton>
      </Stack>

      {child}

      <Stack direction="column" gap={2}>
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
          label="Reminder"
          {...register("reminder")}
          multiline
          rows={6}
        ></TextField>
      </Stack>

      <Stack gap={2}>
        {isLoading && (
          <Button variant="outlined" disabled>
            Processing request
          </Button>
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

export default NewDeviceForm;
