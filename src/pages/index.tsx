import type { NextPage } from "next";

import { trpc } from "../utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";

const Home: NextPage = () => {
  const { data: userInfo } = trpc.auth.getUserInfo.useQuery();

  const { data: sessionData } = useSession();

  if (userInfo) {
    console.log(userInfo);
  }

  return <div></div>;
};

export default Home;
