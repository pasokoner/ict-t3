import { useRouter } from "next/router";

import { useState } from "react";

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
  updatedStatus: string;
  equiptmentName: string;
  equiptmentId: string;
  status: string;
  lastChecked: Date;
};

const CondemnForm = ({
  handleClose,
  updatedStatus,
  equiptmentName,
  equiptmentId,
  status,
  lastChecked,
}: Props) => {
  const { mutate: condemn, isLoading } = trpc.equiptment.update.useMutation({
    onSuccess: () => {
      router.reload();
    },
  });

  const {
    data: partsData,
    isLoading: partsLoading,
    error,
  } = trpc.equiptment.getParts.useQuery({
    equiptmentId: equiptmentId,
  });

  console.log(error?.message);

  const [value, setValue] = useState<Dayjs | null>(null);

  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (partsData && partsData.length > 0) {
      const formattedParts = partsData
        .filter(({ status }) => status === "To condemn")
        .map(({ equiptmentId, ...exceptId }) => {
          return { ...exceptId, status: updatedStatus };
        });
      condemn({
        status: updatedStatus,
        id: equiptmentId,
        reminder: data.reminder,
        date: value ? value.toDate() : undefined,
        parts: formattedParts,
      });
      console.log(formattedParts, updatedStatus);
    } else {
      condemn({
        status: updatedStatus,
        id: equiptmentId,
        reminder: data.reminder,
        date: value ? value.toDate() : undefined,
      });
    }
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const [parts, setParts] = useState<string[]>([]);

  const handleParts = (event: React.MouseEvent<HTMLElement>, newAddedParts: string[]) => {
    setParts(newAddedParts);
  };

  let child: React.ReactNode;
  let note: React.ReactNode;

  if (partsData && partsData?.length > 0) {
    note = (
      <>
        <Typography variant="subtitle2" color="red">
          WARNING! Parts that has a mark &quot;For condemnation&quot; will be condemned
        </Typography>
      </>
    );
    child = (
      <>
        <Stack
          p={1}
          px={2}
          borderRadius={1}
          sx={{
            bgcolor: "primary.light",
            color: "white",
          }}
        >
          <Typography fontSize={18}>List of all parts</Typography>
          <Stack direction="row" gap={2}>
            <Stack direction="row" gap={2}>
              <Box
                component="span"
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "warning.dark",
                }}
              ></Box>
              <Typography variant="subtitle2">For condemnation</Typography>
            </Stack>

            <Stack direction="row" gap={2}>
              <Box
                component="span"
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: "error.dark",
                }}
              ></Box>
              <Typography variant="subtitle2">Condemned</Typography>
            </Stack>
          </Stack>
        </Stack>
        <ToggleButtonGroup
          value={parts}
          onChange={handleParts}
          aria-label="text formatting"
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {partsData
            .sort(
              (a, b) =>
                Number(a.status === "To condemn" || a.status === "Condemned") -
                Number(b.status === "To condemn" || b.status === "Condemned")
            )
            .map(({ id, name, status }) => (
              <ToggleButton
                value={id}
                key={id}
                aria-label="bolds"
                size="small"
                disabled
                disableRipple
                sx={{
                  "&.MuiToggleButton-root": {
                    borderRadius: "0px",
                  },

                  "&.Mui-selected": {
                    bgcolor: "warning.dark",
                    color: "white",
                    "&:hover": {
                      bgcolor: "warning.light",
                    },
                  },

                  "&.Mui-disabled": {
                    color: "primary.dark",
                    ...(status === "To condemn" && {
                      color: "white",
                      bgcolor: "warning.dark",
                    }),
                    ...(status === "Condemned" && {
                      color: "white",
                      bgcolor: "error.dark",
                    }),
                  },
                }}
              >
                {name}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </>
    );
  }

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
          Condemning unit{" "}
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

      {child}

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
        {note}

        {!isLoading && (
          <Button variant="contained" type="submit">
            Submit
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default CondemnForm;
