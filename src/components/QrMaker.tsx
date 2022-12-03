import QRCode from "react-qr-code";
import QRimage from "react-qr-image";
import { Box } from "@mui/material";

type Props = {
  value: string;
};

const QrMaker = ({ value }: Props) => {
  return (
    <>
      {/* <QRCode
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
      /> */}
      <Box
        sx={{
          height: "auto",
          maxWidth: "100%",
          width: "100%",
          m: "0 auto",
        }}
      >
        <QRimage
          text={value}
          transparent={true}
          background="white"
          color="black"
          margin={0}
          size={4}
        >
          shesh
        </QRimage>
      </Box>
    </>
  );
};

export default QrMaker;
