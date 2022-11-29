import React, { useEffect, useState, useRef } from "react";

import type { GetServerSideProps, NextPage } from "next";

import { getSession, signOut } from "next-auth/react";

import { Button, Typography, Stack, LinearProgress } from "@mui/material";

const Unauthorized = () => {
  const [state, setState] = useState({ num: 7 });
  const counter = useRef(0);

  useEffect(() => {
    if (counter.current <= 7) {
      counter.current += 1;
      const timer = setTimeout(() => setState({ num: state.num - 1 }), 1000);
    } else {
      signOut();
    }
  }, [state]);

  return (
    <Stack
      direction="column"
      sx={{
        justifyContent: "center",
        alighItems: "center",
        height: "100%",
      }}
    >
      <Stack>
        <Typography align="center">SORRY BUT YOU DO NOT BELONG TO ANY GROUP</Typography>
        <Typography align="center">Logging you out in a second</Typography>

        <LinearProgress />
      </Stack>
      {/* <Button
        onClick={() => signOut()}
        variant="text"
        sx={{
          m: "0 auto",
          py: 2,
          px: 2,
        }}
      >
        Sign out
      </Button> */}
    </Stack>
  );
};

export default Unauthorized;

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

  return {
    props: { session },
  };
};
