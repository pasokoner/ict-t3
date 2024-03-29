import { GetServerSideProps } from "next";

import { getSession } from "next-auth/react";

import React, { useState, ReactNode, useEffect, useMemo, useRef } from "react";

import { Stack, Button } from "@mui/material";

import { useQrCart } from "../context/QrCartContext";
import PrintableQr from "../components/PrintableQr";

import { useReactToPrint } from "react-to-print";

// import _ from "lodash";

const PrintQr = () => {
  const { cartItems, removeFromCart } = useQrCart();

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const [printItems, setPrintItems] = useState<typeof cartItems>([]);

  // const byDepartment = _.groupBy(cartItems, "department");

  // const departments = _.forOwn(byDepartment, function (value, key) {
  //   setPrintItems((prevState) => [...prevState, ...value]);
  // });

  // console.log(printItems);

  const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  const formattedCart = groupBy(cartItems, (i) => i.department);
  const cartValues = Object.values(formattedCart).flat(2);
  console.log(formattedCart);

  return (
    <Stack gap={3}>
      <Stack
        direction="row"
        gap={2}
        ref={componentRef}
        sx={{
          flexWrap: "wrap",
          justifyContent: "space-evenly",
          py: 0.4,
        }}
      >
        {cartValues &&
          cartValues.map(({ id, quantity }) => {
            return (
              <React.Fragment key={id}>
                {Array(quantity)
                  .fill(0)
                  .map((_, i) => (
                    <React.Fragment key={`${i}${id}`}>
                      <PrintableQr id={id} />
                    </React.Fragment>
                  ))}
              </React.Fragment>
            );
          })}
      </Stack>

      <Button
        variant="outlined"
        onClick={handlePrint}
        sx={{
          m: "0 auto",
        }}
      >
        Start Printing
      </Button>
    </Stack>
  );
};

export default PrintQr;

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
