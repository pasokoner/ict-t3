import QRCode from "react-qr-code";

type Props = {
  value: string;
};

const QrMaker = ({ value }: Props) => {
  return (
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
  );
};

export default QrMaker;
