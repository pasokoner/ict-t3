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

import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../utils/trpc";
import QrMaker from "./QrMaker";

type FormValues = {
  equiptmentName: string;
  equiptmentStatus: "inInventory" | "forRepair" | "forCondemn" | "condemned";
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
    mutate({ name: data.equiptmentName.trim(), status: data.equiptmentStatus.trim() });
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
            <MenuItem value={"inInventory"}>In Inventory</MenuItem>
            <MenuItem value={"forRepair"}>For Repair</MenuItem>
            <MenuItem value={"toCondemn"}>To Condemn</MenuItem>
            <MenuItem value={"condemned"}>Condemned</MenuItem>
          </Select>
        </FormControl>
        {errors.equiptmentStatus && errors.equiptmentStatus.type === "required" && (
          <Typography color="error" variant="subtitle2">
            This is required
          </Typography>
        )}
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
