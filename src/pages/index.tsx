import type { GetServerSideProps, NextPage } from "next";

import { getSession, signIn } from "next-auth/react";

import { Stack, Button } from "@mui/material";

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
