import { GetServerSideProps } from "next";

import { useRouter } from "next/router";

import { getSession } from "next-auth/react";

import { useState } from "react";

import { trpc } from "../../utils/trpc";

import {
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
  Backdrop,
  LinearProgress,
  Box,
} from "@mui/material";
import { conditions, getFormattedDate, statusColorGenerator } from "../../utils/constant";
import ActionMaker from "../../components/ActionMaker";
import { useSession } from "next-auth/react";

import { departments } from "../../utils/constant";

import { useForm, SubmitHandler } from "react-hook-form";

import PrintableQr from "../../components/PrintableQr";
import { useQrCart } from "../../context/QrCartContext";

type FormValues = {
  department: string;
  issuedTo: string;
  usedBy: string;
  condition: string;
  currentUser?: string;
  reminder?: string;
};

const EquiptmentId = () => {
  const router = useRouter();

  const { data: sessionData } = useSession();

  const { increaseCartQuantity } = useQrCart();

  const [editOwnership, setEditOwnership] = useState(false);
  const [editDepartment, setEditDepartment] = useState(false);
  const [editCondition, setEditCondition] = useState(false);

  const [errorOwnership, setErrorOwnership] = useState("");
  const [errorDepartment, setErrorDepartment] = useState("");
  const [errorCondition, setErrorCondition] = useState("");

  const { data, isLoading, refetch } = trpc.equiptment.getDetails.useQuery({
    id: router.query.equiptmentId as string,
  });

  const { mutate: deleteEquiptment } = trpc.equiptment.delete.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  const { mutate: changeOwnership, isLoading: ownershipLoading } =
    trpc.equiptment.ownership.useMutation({
      onSuccess: () => {
        handleClick();
        setErrorOwnership("");
        setSnackbarMessage("Ownership changed!");
        reset((formValues) => ({
          ...formValues,
          reminder: "",
        }));
        refetch();
      },
    });

  const { mutate: changeDepartment, isLoading: departmentLoading } =
    trpc.equiptment.department.useMutation({
      onSuccess: () => {
        handleClick();
        setErrorDepartment("");
        setSnackbarMessage("Department changed!");
        reset((formValues) => ({
          ...formValues,
          reminder: "",
        }));
        refetch();
      },
    });

  const { mutate: changeCondition, isLoading: conditionLoading } =
    trpc.equiptment.condition.useMutation({
      onSuccess: () => {
        handleClick();
        setErrorCondition("");
        setSnackbarMessage("Condition changed!");
        reset((formValues) => ({
          ...formValues,
          reminder: "",
        }));
        refetch();
      },
    });

  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async ({
    issuedTo,
    usedBy,
    department,
    condition,
    currentUser,
    reminder,
  }) => {
    if (!data?.current?.id) {
      return;
    }

    if (issuedTo || usedBy || currentUser) {
      if (
        (issuedTo ? issuedTo.trim() : null) === data?.current?.issuedTo &&
        (usedBy ? usedBy.trim() : null) === data?.current?.usedBy &&
        (currentUser ? currentUser.trim() : null) === data?.current?.currentUser
      ) {
        setErrorOwnership("You are trying to change nothing!");
      } else {
        changeOwnership({
          usedBy: usedBy ? usedBy.trim() : null,
          currentUser: currentUser ? currentUser.trim() : null,
          issuedTo: issuedTo ? issuedTo : null,
          equiptmentId: data.current.id,
          reminder: reminder ? reminder.trim() : null,
        });
      }
    }

    if (condition) {
      if (condition.trim() === data?.current?.condition) {
        setErrorCondition("You are trying to change nothing");
      } else {
        changeCondition({
          equiptmentId: data.current.id,
          condition: condition,
          reminder: reminder ? reminder.trim() : null,
        });
      }
    }

    if (department) {
      if (department.trim() === data?.current?.department) {
        setErrorDepartment("You are trying to change nothing!");
      } else {
        changeDepartment({
          equiptmentId: data.current.id,
          department: department,
          reminder: reminder ? reminder.trim() : null,
        });
      }
    }
  };

  const handleCancel = () => {
    setEditDepartment(false);
    setEditOwnership(false);
    setEditCondition(false);
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

  const [deleting, setDeleting] = useState(false);

  if (isLoading) {
    return <></>;
  }

  if (data && !data.current) {
    return <Typography>No equiptment found!</Typography>;
  }

  // console.log(data?.current?.currentUser, data?.current?.usedBy, data?.current?.issuedTo);

  return (
    <Stack gap={1.5}>
      <Typography
        sx={{
          py: 1,
          px: 2,
          borderRadius: 1,
          bgcolor: "#3c8da4",
          color: "white",
          fontSize: { md: 35, xs: 28 },
        }}
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
            bgcolor: "grey.400",
            fontWeight: "500",
          },
        }}
      >
        <Stack gap={1}>
          <Stack
            direction="row"
            sx={{
              p: 1,
            }}
          >
            <PrintableQr id={data?.current?.id as string} />
          </Stack>
          <Stack direction="row" alignItems="center" gap={2}>
            <Stack direction="row" gap={1} alignItems="center">
              <Typography>Status:</Typography>
              <Typography
                noWrap
                sx={{
                  bgcolor: statusColorGenerator(data?.current?.status as string),
                  borderRadius: "5px",
                  p: 1,
                  color: "white",
                  mr: "auto",
                }}
              >
                {data?.current?.status}
              </Typography>
            </Stack>
            <Button
              variant="outlined"
              onClick={() => {
                increaseCartQuantity(
                  data?.current?.id as string,
                  data?.current?.department as string
                );
              }}
            >
              Print
            </Button>
            <ActionMaker
              id={data?.current?.id as string}
              direction="row"
              status={data?.current?.status as string}
              name={data?.current?.name as string}
              group={sessionData?.user?.group as string}
              lastChecked={data?.current?.date as Date}
            />
          </Stack>
        </Stack>

        <Stack direction="row" gap={3}>
          <Button
            size="small"
            variant="contained"
            disabled={ownershipLoading || departmentLoading || conditionLoading}
            onClick={() => {
              setEditOwnership((prevState) => !prevState);
              setEditDepartment(false);
              setEditCondition(false);
            }}
          >
            Ownership
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={ownershipLoading || departmentLoading || conditionLoading}
            onClick={() => {
              setEditOwnership(false);
              setEditDepartment((prevState) => !prevState);
              setEditCondition(false);
            }}
          >
            Department
          </Button>
          <Button
            size="small"
            variant="contained"
            disabled={ownershipLoading || departmentLoading || conditionLoading}
            onClick={() => {
              setEditOwnership(false);
              setEditDepartment(false);
              setEditCondition((prevState) => !prevState);
            }}
          >
            Condition
          </Button>
        </Stack>

        {(editDepartment || editOwnership || editCondition) && (
          <Stack component="form" m={1} gap={2} onSubmit={handleSubmit(onSubmit)}>
            {editOwnership && (
              <>
                <Stack gap={2} justifyContent="space-between">
                  <TextField
                    size="small"
                    variant="standard"
                    label="Issued to:"
                    defaultValue={data?.current?.issuedTo}
                    {...register("issuedTo")}
                  />
                  <TextField
                    size="small"
                    variant="standard"
                    label="Used by:"
                    defaultValue={data?.current?.usedBy}
                    {...register("usedBy")}
                  />
                  <TextField
                    size="small"
                    variant="standard"
                    label="Current user:"
                    defaultValue={data?.current?.currentUser}
                    {...register("currentUser")}
                  />
                </Stack>

                {errorOwnership && (
                  <Typography color="error" mt={-1} fontSize={14}>
                    {errorOwnership}
                  </Typography>
                )}
              </>
            )}

            {editDepartment && (
              <>
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">Department</InputLabel>
                  <Select
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

            {editCondition && (
              <>
                <FormControl fullWidth required>
                  <InputLabel id="demo-simple-select-label">Condition</InputLabel>
                  <Select
                    label="Conditions"
                    variant="standard"
                    {...register("condition")}
                    defaultValue={data?.current?.condition}
                  >
                    {conditions.map(({ name, value }, i) => (
                      <MenuItem key={i} value={value}>
                        <Box
                          component="span"
                          sx={{
                            width: 20,
                            height: 20,
                            border: 2,
                            mr: 1,
                            ml: 2,
                            backgroundColor:
                              value === "IIIO" ? "white" : value === "NIIO" ? "#ff5959" : "#fff700",
                          }}
                        ></Box>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errorCondition && (
                  <Typography color="error" mt={-1} fontSize={14}>
                    {errorCondition}
                  </Typography>
                )}
              </>
            )}

            {(editDepartment || editOwnership || editCondition) && (
              <TextField
                variant="outlined"
                label="Description"
                {...register("reminder")}
                helperText="Having a detailed explanation of your action helps you track changes."
                multiline
                rows={3}
              />
            )}

            {(ownershipLoading || departmentLoading || conditionLoading) && <LinearProgress />}

            <Stack direction="row" gap={1} justifyContent="center">
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={handleCancel}
                disabled={ownershipLoading || departmentLoading || conditionLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="success"
                variant="contained"
                size="small"
                disabled={ownershipLoading || departmentLoading || conditionLoading}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        )}

        <Stack
          gap={2}
          sx={{
            flexDirection: { md: "row", xs: "column" },
            "& > *": {
              width: { md: "50%", xs: "100%" },
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
          <Typography variant="subtitle1">Description</Typography>
          <Typography variant="subtitle2">
            {data?.current?.reminder ? data?.current?.reminder : "N/A"}
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
                      lastChecked={data?.current?.date as Date}
                    />
                  )}
                </Stack>
              ))}
            </Stack>
          </>
        )}

        <Typography sx={{ px: 2, py: 1, borderRadius: 1, bgcolor: "#3c8da4", color: "white" }}>
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
            <Typography variant="subtitle1">Current user</Typography>
            <Typography variant="subtitle2">
              {data?.current?.currentUser ? data?.current?.currentUser : "N/A"}
            </Typography>
          </Stack>

          <Stack>
            <Typography variant="subtitle1">Department</Typography>
            <Typography variant="subtitle2">{data?.current?.department}</Typography>
          </Stack>
        </Stack>
      </Stack>

      <Typography
        variant="h6"
        sx={{ px: 2, py: 1, borderRadius: 1, bgcolor: "#3c8da4", color: "white" }}
      >
        History
      </Typography>
      {data &&
        data.history.length > 0 &&
        data.history?.map(
          ({
            status,
            user,
            date,
            id,
            partsHistory,
            department,
            issuedTo,
            usedBy,
            reminder,
            currentUser,
          }) => (
            <Stack
              key={id}
              gap={0.5}
              sx={{
                "& .MuiTypography-subtitle1": {
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  bgcolor: "primary.light",
                  color: "white",
                },
              }}
            >
              <Typography variant="subtitle1">{getFormattedDate(new Date(date))}</Typography>

              <Stack gap={0.3} sx={{ px: 2, py: 1.5, borderRadius: 1, bgcolor: "#f4f4f4" }}>
                <Stack direction="row" gap={1}>
                  <Typography>Handler: </Typography>
                  <Typography>{user.name}</Typography>
                </Stack>

                <Stack direction="row" gap={1}>
                  <Typography>Status: </Typography>
                  <Typography
                    align="center"
                    noWrap
                    sx={{
                      bgcolor: statusColorGenerator(status),
                      p: 0.3,
                      borderRadius: "5px",
                      color: "white",
                      mr: "auto",
                    }}
                  >
                    {status}
                  </Typography>
                </Stack>

                {status === "Department" && (
                  <Stack direction="row" gap={1}>
                    <Typography>New department: </Typography>
                    <Typography noWrap>{department}</Typography>
                  </Stack>
                )}

                {status === "Ownership" && (
                  <>
                    <Stack direction="row" gap={1}>
                      <Typography>Issued to: </Typography>
                      <Typography>{issuedTo ? issuedTo : "N/A"}</Typography>
                    </Stack>

                    <Stack direction="row" gap={1}>
                      <Typography>Used by: </Typography>
                      <Typography>{usedBy ? usedBy : "N/A"}</Typography>
                    </Stack>

                    <Stack direction="row" gap={1}>
                      <Typography>Current User: </Typography>
                      <Typography>{currentUser ? currentUser : "N/A"}</Typography>
                    </Stack>
                  </>
                )}

                {partsHistory && partsHistory.length > 0 && (
                  <Stack direction="row" gap={2} alignItems="center">
                    <Typography>Parts Affected:</Typography>

                    {partsHistory.map(({ name, status, id }) => (
                      <Typography
                        key={id}
                        sx={{
                          bgcolor: statusColorGenerator(status),
                          p: 1,
                          color: "white",
                        }}
                      >
                        {name}
                      </Typography>
                    ))}
                  </Stack>
                )}

                <Stack direction="row" gap={1}>
                  <Typography>Description: </Typography>
                  <Typography>{reminder ? reminder : "N/A"}</Typography>
                </Stack>
              </Stack>
            </Stack>
          )
        )}
      {sessionData && sessionData.user?.role === "SUPERADMIN" && (
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            setDeleting(true);
          }}
          sx={{
            p: 3,
          }}
        >
          DELETE EQUIPTMENT
        </Button>
      )}
      {/* 
      <Button
        variant="outlined"
        color="error"
        onClick={() => {
          setDeleting(true);
        }}
        sx={{
          p: 3,
        }}
      >
        DELETE EQUIPTMENT
      </Button> */}

      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deleting}>
        <Stack>
          <Typography
            sx={{
              bgcolor: "primary.main",
              p: 3,
            }}
          >
            Delete this equiptment permanently?
          </Typography>

          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteEquiptment({ equiptmentId: data?.current?.id as string });
            }}
            sx={{
              p: 1.5,
            }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              setDeleting(false);
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Backdrop>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%", color: "#2A3990" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default EquiptmentId;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!session?.user?.role && !session?.user?.group) {
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
