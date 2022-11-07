import type { NextPage } from "next";

import React, { useState } from "react";
import Scanner from "../components/Scanner";
import { trpc } from "../utils/trpc";

import { Box, IconButton, Stack, Typography } from "@mui/material";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Home: NextPage = () => {
  const [cameraResult, setCameraResult] = useState("");

  const { data } = trpc.equiptment.detect.useQuery({ id: cameraResult });

  console.log(data);

  const { data: sessionData } = useSession();

  return <Box></Box>;
};

export default Home;
