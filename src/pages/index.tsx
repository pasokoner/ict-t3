import type { NextPage } from "next";

import React from "react";

import { Stack, Button } from "@mui/material";
import { signIn } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <Stack>
      <Button
        onClick={() => {
          signIn();
        }}
      >
        Sign in
      </Button>
    </Stack>
  );
};

export default Home;
