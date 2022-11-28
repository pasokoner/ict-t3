import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { trpc } from "../../utils/trpc";

import { Typography, Stack, IconButton, Button, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import dayjs, { Dayjs } from "dayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { useForm, SubmitHandler } from "react-hook-form";
import { getFormattedDate } from "../../utils/constant";

type FormValues = {
  date: string;
  reminder: string;
};

type Props = {
  handleClose: () => void;
  equiptmentName: string;
  equiptmentId: string;
  serial: string;
  lastChecked: Date;
};

const CondemnPartsForm = ({
  handleClose,
  equiptmentName,
  equiptmentId,
  serial,
  lastChecked,
}: Props) => {
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
          mb: 1,
          "& .MuiTypography-root": {
            fontSize: { md: 25, xs: 18 },
          },
        }}
      >
        <Typography>
          Condemning parts{" "}
          <Typography
            component="span"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 1,
              borderRadius: "5px",
            }}
          >
            {equiptmentName.length >= 60
              ? `${equiptmentName.slice(0, 60) + "..."}`
              : equiptmentName}
          </Typography>
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            ml: "auto",
          }}
        >
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
            minDate={dayjs(getFormattedDate(lastChecked))}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                sx={{ minWidth: 200, alignSelf: "flex-end" }}
                fullWidth
              />
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
