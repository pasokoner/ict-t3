import { trpc } from "../utils/trpc";

import { useState } from "react";

import {
  Button,
  Backdrop,
  ButtonGroup,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Typography,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import { useForm, SubmitHandler } from "react-hook-form";

type Props = {
  name: string;
  email: string;
  id: string;
  userRole: string;
  userGroup: "PITO" | "GSO";
  fetchPendingAccounts: () => void;
};

type FormValues = {
  role: "USER" | "ADMIN";
  group: "PITO" | "GSO";
};

const PendingRows = ({ name, email, id, userRole, userGroup, fetchPendingAccounts }: Props) => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState("");
  const [group, setGroup] = useState("");

  const matches = useMediaQuery("(max-width:600px)");

  const { handleSubmit, register, reset } = useForm<FormValues>();

  const { mutate } = trpc.auth.updatePermission.useMutation({
    onSuccess: () => {
      reset();
      setOpen(false);
      fetchPendingAccounts();
    },
  });

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleRole = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  const handleGroup = (event: SelectChangeEvent) => {
    setGroup(event.target.value as string);
  };

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    mutate({ ...data, id: id });
  };

  return (
    <TableRow
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        "& > *": {
          py: 1,
        },
      }}
    >
      <TableCell
        component="th"
        scope="row"
        sx={{
          ...(!matches && {
            width: "45%",
          }),
        }}
      >
        {name}
      </TableCell>
      {!matches && (
        <TableCell
          sx={{
            width: "45%",
          }}
        >
          {email}
        </TableCell>
      )}

      <TableCell
        sx={{
          width: "5%",
        }}
      >
        <ButtonGroup variant="text">
          <IconButton>
            <CloseIcon color="error" />
          </IconButton>

          {userRole === "SUPERADMIN" && (
            <IconButton onClick={() => handleToggle()}>
              <CheckIcon color="success" />
            </IconButton>
          )}

          {userRole === "ADMIN" && (
            <IconButton
              onClick={() => {
                mutate({ id: id, role: "USER", group: userGroup });
              }}
            >
              <CheckIcon color="success" />
            </IconButton>
          )}
        </ButtonGroup>
      </TableCell>
      <TableCell>
        <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
          <Stack
            gap={3}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              width: { md: "50%", xs: "70%" },
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
                alignItems: "center",
              }}
            >
              <Typography fontWeight="medium" fontSize={20}>
                Set permission for - {name}
              </Typography>

              <IconButton onClick={() => handleToggle()}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Role"
                size="medium"
                {...register("role", { onChange: handleRole, required: true })}
              >
                <MenuItem value={"USER"}>USER</MenuItem>
                <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Group</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={group}
                label="Group"
                size="medium"
                {...register("group", { onChange: handleGroup, required: true })}
              >
                <MenuItem value={"PITO"}>PITO</MenuItem>
                <MenuItem value={"GSO"}>GSO</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              type="submit"
              sx={{
                mt: "auto",
              }}
            >
              Apply Changes
            </Button>
          </Stack>
        </Backdrop>
      </TableCell>
    </TableRow>
  );
};

export default PendingRows;
