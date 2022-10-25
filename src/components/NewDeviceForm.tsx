import React, { useState } from "react";

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

import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  equiptmentName: string;
  equiptmentStatus: "inInventory" | "forRepair" | "forCondemn" | "condemned";
};

type Props = {
  handleClose: () => void;
};

const NewDeviceForm = ({ handleClose }: Props) => {
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
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
        {/* <input {...register("firstName")} />
        <input {...register("lastName")} />
        <input type="email" {...register("email")} /> */}
        <TextField
          id="outlined-basic"
          label="Equipment"
          variant="outlined"
          {...register("equiptmentName")}
        />

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Equiptment Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Equiptment Status"
            {...register("equiptmentStatus", { onChange: handleChange })}
          >
            <MenuItem value={"inInventory"}>In Inventory</MenuItem>
            <MenuItem value={"forRepair"}>For Repair</MenuItem>
            <MenuItem value={"toCondemn"}>To Condemn</MenuItem>
            <MenuItem value={"condemned"}>Condemned</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Button
        variant="outlined"
        type="submit"
        sx={{
          mt: "auto",
        }}
      >
        Submit
      </Button>
    </Stack>
  );
};

export default NewDeviceForm;
