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

type NewParts = {
  name: string;
  serial: string;
};

const InventoryForm = ({
  handleClose,
  updatedStatus,
  equiptmentName,
  equiptmentId,
  status,
  lastChecked,
}: Props) => {
  const { mutate: inInventory, isLoading } = trpc.equiptment.update.useMutation({
    onSuccess: () => {
      router.reload();
    },
  });

  const { data: partsData, isLoading: partsLoading } = trpc.equiptment.getParts.useQuery({
    equiptmentId: equiptmentId,
  });

  const [value, setValue] = useState<Dayjs | null>(null);

  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (status === "Unserviceable") {
      if (newParts.length > 0) {
        inInventory({
          status: updatedStatus,
          id: equiptmentId,
          reminder: data.reminder,
          date: value ? value.toDate() : undefined,
          newParts: newParts,
        });
      } else {
        setEmptyParts("Add a new parts to reissue this unit");
        return;
      }
    } else {
      inInventory({
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

  const [defaultParts, setDefaultParts] = useState<string[]>([]);

  const [emptyParts, setEmptyParts] = useState("");

  const [newParts, setNewParts] = useState<NewParts[]>([]);

  const [partsName, setPartsName] = useState("");
  const [partsSerial, setPartsSerial] = useState("");

  const [addParts, setAddParts] = useState(false);

  const handleCloseAdd = () => {
    setAddParts(false);
  };

  const handleOpen = () => {
    setAddParts(true);
  };

  const [parts, setParts] = useState<string[]>([]);

  const handleParts = (event: React.MouseEvent<HTMLElement>, newAddedParts: string[]) => {
    setParts(newAddedParts);
  };

  let child: React.ReactNode;
  let note: React.ReactNode;

  if (status === "Unserviceable") {
    note = (
      <Typography variant="subtitle2" color="red">
        WARNING! All parts will also change its status to &quot;For repair&quot;
      </Typography>
    );
  }

  if (partsData && partsData?.length > 0 && status === "Unserviceable") {
    note = (
      <>
        <Typography variant="subtitle2" color="red">
          WARNING! Parts that has a mark &quot;For condemnation&quot; & &quot;Condemn&quot; needed
          to be replace for reissuing this equiptment
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

        <Typography
          p={1}
          px={2}
          borderRadius={1}
          sx={{
            bgcolor: "primary.light",
            color: "white",
          }}
        >
          Add new parts here
        </Typography>

        {newParts.length > 0 &&
          newParts.map(({ name, serial }, i) => (
            <Stack key={i} direction="row" gap={2}>
              <Typography
                sx={{
                  width: "55%",
                }}
              >
                {name}
              </Typography>
              <Typography> {serial}</Typography>
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
              required
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
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPartsSerial(e.target.value);
              }}
            />
          </Stack>
        )}

        {addParts && (
          <Stack direction="row" justifyContent="center" gap={3}>
            <Button color="error" variant="contained" onClick={handleCloseAdd}>
              cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                if (partsName.trim() && partsSerial.trim()) {
                  setNewParts((prevState) => [
                    ...prevState,
                    { name: partsName.trim(), serial: partsSerial.trim() },
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
      </>
    );
  }

  useEffect(() => {
    if (partsData && partsData?.length > 0) {
      const defaultParts = partsData
        .filter(({ status }) => status === "Unserviceable")
        .map(({ id }) => {
          setDefaultParts((prevState) => [...prevState, id]);
          return id;
        });

      setParts((prevState) => [...prevState, ...defaultParts]);
    }
  }, [partsData]);

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
          Back to inventory{" "}
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
          label={status === "For repair" ? "Diagnostic Report" : "Reminder"}
          {...register("reminder")}
          multiline
          required={status === "For repair"}
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
        {emptyParts && <Typography color="error">{emptyParts}</Typography>}
        {!isLoading && (
          <Button variant="contained" type="submit">
            Submit
          </Button>
        )}
      </Stack>
    </Stack>
  );
};

export default InventoryForm;
