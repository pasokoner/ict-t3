import React from "react";
import QRCode from "react-qr-code";

type Props = {
  value: string;
};

const QrMaker = ({ value }: Props) => {
  return (
    // <div
    //   style={{
    //     height: "auto",
    //     margin: "0 auto",
    //     maxWidth: 100,
    //     width: "100%",
    //   }}
    // >
    <>
      <QRCode
        size={256}
        style={{
          height: "auto",
          maxWidth: "100%",
          width: "100%",
          backgroundColor: "#000000",
          color: "#FFF",
        }}
        value={value}
        viewBox={`0 0 256 256`}
      />
    </>
    // </div>
  );
};

export default QrMaker;
