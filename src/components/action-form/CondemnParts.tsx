import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { trpc } from "../../utils/trpc";

import {
  Typography,
  Stack,
  IconButton,
  Button,
  TextField,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  date: string;
  reminder: string;
};

type Props = {
  handleClose: () => void;
  equiptmentName: string;
  equiptmentId: string;
  serial: string;
};

const CondemnPartsForm = ({ handleClose, equiptmentName, equiptmentId, serial }: Props) => {
  const { mutate: condemnParts, isLoading } = trpc.equiptment.condemnParts.useMutation({
    onSuccess: () => {
      router.reload();
    },
  });

  const [value, setValue] = useState<Dayjs | null>(null);

  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    condemnParts({
      id: equiptmentId,
      reminder: data.reminder,
      date: value ? value.toDate() : undefined,
      serial: serial,
    });
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

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
          Sending for condemn{" "}
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
            {equiptmentName}
          </Typography>
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon color="primary" />
        </IconButton>
      </Stack>

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

export default CondemnPartsForm;
