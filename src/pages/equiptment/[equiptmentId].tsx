import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { getFormattedDate, statusColorGenerator } from "../../utils/constant";
import QrMaker from "../../components/QrMaker";
import ActionMaker from "../../components/ActionMaker";
import { useSession } from "next-auth/react";

import { departments } from "../../utils/constant";

import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  department: string;
  issuedTo: string;
  usedBy: string;
};

const EquiptmentId = () => {
  const router = useRouter();

  const { data: sessionData } = useSession();

  const [editOwnership, setEditOwnership] = useState(false);
  const [editDepartment, setEditDepartment] = useState(false);

  const [errorOwnership, setErrorOwnership] = useState("");
  const [errorDepartment, setErrorDepartment] = useState("");

  const { data, isLoading, refetch } = trpc.equiptment.getDetails.useQuery({
    id: router.query.equiptmentId as string,
  });

  const { mutate: changeOwnership, isLoading: ownershipLoading } =
    trpc.equiptment.ownership.useMutation({
      onSuccess: () => {
        handleClick();
        setSnackbarMessage("Ownership changed!");
        setErrorOwnership("");
        refetch();
      },
    });

  const { mutate: changeDepartment, isLoading: departmentLoading } =
    trpc.equiptment.department.useMutation({
      onSuccess: () => {
        handleClick();
        setSnackbarMessage("Department changed!");
        setErrorDepartment("");
        refetch();
      },
    });

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async ({ issuedTo, usedBy, department }) => {
    if (!data?.current?.id) {
      return;
    }
    if (issuedTo && usedBy) {
      if (
        issuedTo.trim() === data?.current?.issuedTo &&
        usedBy.trim() === data?.current?.issuedTo
      ) {
        setErrorOwnership("You are trying to change nothing!");
      } else if (
        issuedTo.trim() !== data?.current?.issuedTo &&
        usedBy.trim() !== data?.current?.issuedTo
      ) {
        changeOwnership({ issuedTo: issuedTo, usedBy: usedBy, equiptmentId: data.current.id });
      } else if (
        issuedTo.trim() === data?.current?.issuedTo &&
        usedBy.trim() !== data?.current?.issuedTo
      ) {
        changeOwnership({ usedBy: usedBy, equiptmentId: data?.current?.id });
      } else if (
        issuedTo.trim() !== data?.current?.issuedTo &&
        usedBy.trim() === data?.current?.issuedTo
      ) {
        changeOwnership({ issuedTo: issuedTo, equiptmentId: data?.current?.id });
      }
    }

    if (department) {
      if (department.trim() === data?.current?.department) {
        setErrorDepartment("You are trying to change nothing!");
      } else {
        changeDepartment({
          equiptmentId: data.current.id,
          department: department,
        });
      }
    }
  };

  const handleCancel = () => {
    setEditDepartment(false);
    setEditOwnership(false);
  };

  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  if (isLoading) {
    return <></>;
  }

  if (data && !data.current) {
    return <Typography>No equiptment found!</Typography>;
  }

  return (
    <Stack gap={2}>
      <Typography
        variant="h4"
        sx={{ p: 1, borderRadius: 1, bgcolor: "primary.main", color: "white" }}
      >
        Equiptment Details Breakdown
      </Typography>

      <Stack
        gap={1}
        sx={{
          "& .MuiTypography-subtitle1": {
            py: 0.2,
            px: 1,
            borderRadius: 1,
            bgcolor: "primary.light",
            color: "white",
          },
        }}
      >
        <Stack gap={1}>
          <Box
            sx={{
              maxWidth: 80,
            }}
          >
            <QrMaker value={data?.current?.id as string} />
          </Box>
          <Stack direction="row" alignItems="center" gap={2}>
            <Stack direction="row" gap={1}>
              <Typography>Status:</Typography>
              <Typography
                noWrap
                sx={{
                  bgcolor: statusColorGenerator(data?.current?.status as string),
                  borderRadius: "5px",
                  color: "white",
                  mr: "auto",
                }}
              >
                {data?.current?.status}
              </Typography>
            </Stack>
            <ActionMaker
              id={data?.current?.id as string}
              direction="row"
              status={data?.current?.status as string}
              name={data?.current?.name as string}
              group={sessionData?.user?.group as string}
            />
          </Stack>
        </Stack>

        <Stack direction="row" gap={3}>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setEditDepartment(false);
              setEditOwnership(true);
            }}
          >
            Ownership
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setEditOwnership(false);
              setEditDepartment(true);
            }}
          >
            Department
          </Button>
        </Stack>

        {(editDepartment || editOwnership) && (
          <Stack component="form" m={1} gap={2} onSubmit={handleSubmit(onSubmit)}>
            {editDepartment && (
              <>
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">Department</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Department"
                    variant="standard"
                    {...register("department")}
                    defaultValue={data?.current?.department}
                    // {...register("department")}
                  >
                    {departments.map(({ acronym, name }, i) => (
                      <MenuItem key={i} value={acronym}>
                        {acronym} - {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {errorDepartment && (
                  <Typography color="error" mt={-1} fontSize={14}>
                    {errorDepartment}
                  </Typography>
                )}
              </>
            )}

            {editOwnership && (
              <Stack gap={2} direction="row" justifyContent="space-between">
                <TextField
                  size="small"
                  variant="standard"
                  label="Issued to:"
                  defaultValue={data?.current?.issuedTo}
                  required
                  {...register("issuedTo")}
                  sx={{
                    width: "50%",
                  }}
                />
                <TextField
                  size="small"
                  variant="standard"
                  label="Used by:"
                  defaultValue={data?.current?.usedBy}
                  required
                  {...register("usedBy")}
                  sx={{
                    width: "50%",
                  }}
                />
              </Stack>
            )}

            {errorOwnership && (
              <Typography color="error" mt={-1} fontSize={14}>
                {errorOwnership}
              </Typography>
            )}
            <Stack direction="row" gap={1} justifyContent="center">
              <Button size="small" color="error" variant="contained" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" color="success" variant="contained" size="small">
                Save
              </Button>
            </Stack>
          </Stack>
        )}

        <Stack
          direction="row"
          gap={2}
          sx={{
            "& > *": {
              width: "50%",
            },
          }}
        >
          <Stack>
            <Typography variant="subtitle1">Equiptment Name</Typography>
            <Typography variant="subtitle2">{data?.current?.name}</Typography>
          </Stack>

          <Stack>
            <Typography variant="subtitle1">Serial</Typography>
            <Typography variant="subtitle2">{data?.current?.serial}</Typography>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          gap={2}
          sx={{
            "& > *": {
              width: "50%",
            },
          }}
        >
          <Stack>
            <Typography variant="subtitle1">Last Handler to check</Typography>
            <Typography variant="subtitle2">{data?.current?.user.name}</Typography>
          </Stack>

          <Stack>
            <Typography variant="subtitle1">Last checked</Typography>
            <Typography variant="subtitle2">
              {getFormattedDate(new Date(data?.current?.date as Date))}
            </Typography>
          </Stack>
        </Stack>

        <Stack>
          <Typography variant="subtitle1">Reminder</Typography>
          <Typography variant="subtitle2">
            {data?.current?.reminder ? data?.current?.reminder : "No reminders"}
          </Typography>
        </Stack>

        {data?.current?.parts && data?.current?.parts.length > 0 && (
          <>
            <Typography variant="subtitle1">All parts</Typography>
            <Stack direction="row" gap={2}>
              {data?.current?.parts.map(({ name, status, id, serial }) => (
                <Stack
                  key={id}
                  direction="row"
                  alignItems="center"
                  gap={1}
                  sx={{
                    bgcolor: statusColorGenerator(status),
                    p: 1,
                    color: "white",
                  }}
                >
                  <Typography>{name}</Typography>
                  {status === "To condemn" && (
                    <ActionMaker
                      direction="row"
                      status={status}
                      group={sessionData?.user?.group as string}
                      size="small"
                      id={data?.current?.id as string}
                      name={name}
                      isParts={true}
                      serial={serial}
                    />
                  )}
                </Stack>
              ))}
            </Stack>
          </>
        )}

        <Typography sx={{ p: 1, borderRadius: 1, bgcolor: "primary.main", color: "white" }}>
          Issuance Details
        </Typography>
        <Stack
          direction="row"
          gap={2}
          sx={{
            "& > *": {
              width: "50%",
            },
          }}
        >
          <Stack>
            <Typography variant="subtitle1">Issued to</Typography>
            <Typography variant="subtitle2">{data?.current?.issuedTo}</Typography>
          </Stack>

          <Stack>
            <Typography variant="subtitle1">Used By</Typography>
            <Typography variant="subtitle2">{data?.current?.usedBy}</Typography>
          </Stack>
        </Stack>

        <Stack>
          <Typography variant="subtitle1">Department</Typography>
          <Typography variant="subtitle2">{data?.current?.department}</Typography>
        </Stack>
      </Stack>

      <Typography
        variant="h6"
        sx={{ p: 1, borderRadius: 1, bgcolor: "primary.main", color: "white" }}
      >
        History
      </Typography>
      {data &&
        data.history.length > 0 &&
        data.history?.map(({ status, user, date, id, partsHistory }) => (
          <Stack
            key={id}
            gap={0.5}
            sx={{
              "& .MuiTypography-subtitle1": {
                p: 0.5,
                borderRadius: 1,
                bgcolor: "error.light",
                color: "white",
              },
            }}
          >
            <Typography variant="subtitle1">{getFormattedDate(new Date(date))}</Typography>

            <Stack
              gap={0.3}
              sx={{ p: 0.5, borderRadius: 1, bgcolor: "primary.light", color: "white" }}
            >
              <Stack direction="row">
                <Typography sx={{ minWidth: "70px" }}>Handler: </Typography>
                <Typography>{user.name}</Typography>
              </Stack>

              <Stack direction="row">
                <Typography sx={{ minWidth: "70px" }}>Status: </Typography>
                <Typography
                  align="center"
                  noWrap
                  sx={{
                    bgcolor: statusColorGenerator(status),
                    borderRadius: "5px",
                    color: "white",
                    mr: "auto",
                  }}
                >
                  {status}
                </Typography>
              </Stack>

              {partsHistory && partsHistory.length > 0 && (
                <Stack direction="row" gap={2} alignItems="center">
                  <Typography>Parts Affected:</Typography>

                  {partsHistory.map(({ name, status, id }) => (
                    <Typography
                      key={id}
                      sx={{
                        bgcolor: statusColorGenerator(status),
                        p: 0.3,
                        color: "white",
                      }}
                    >
                      {name}
                    </Typography>
                  ))}
                </Stack>
              )}
            </Stack>
          </Stack>
        ))}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%", color: "#2A3990" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default EquiptmentId;
