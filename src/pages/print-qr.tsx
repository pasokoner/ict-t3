import React, { useState, ReactNode, useEffect, useMemo, useRef } from "react";

import { Stack, Button } from "@mui/material";

import { useQrCart } from "../context/QrCartContext";
import PrintableQr from "../components/PrintableQr";

import { useReactToPrint } from "react-to-print";

// import _ from "lodash";

const PrintQr = () => {
  const { cartItems } = useQrCart();

  console.log(cartItems);

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

  return (
    <Stack gap={3}>
      <Stack
        direction="row"
        gap={2}
        ref={componentRef}
        sx={{
          flexWrap: "wrap",
          p: 2,
        }}
      >
        {cartItems &&
          cartItems.map(({ id, quantity }) => {
            return (
              <React.Fragment key={id}>
                {Array(quantity)
                  .fill(0)
                  .map((_, i) => (
                    <PrintableQr key={`${i}${id}`} id={id} />
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
