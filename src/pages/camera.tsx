import React, { useState, useRef, useEffect } from "react";
import Scanner from "../components/scanner";
import QrMaker from "../components/QrMaker";
import { trpc } from "../utils/trpc";

const CameraPage = () => {
  const [cameraResult, setCameraResult] = useState("");

  const deviceRef = useRef<HTMLInputElement>(null);

  const { data } = trpc.qrcode.detect.useQuery({ id: cameraResult });

  const { mutate, data: equiptmentData } = trpc.qrcode.add.useMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (deviceRef.current?.value) {
      mutate({ name: deviceRef.current?.value });

      deviceRef.current.value = "";
    }
  };

  return (
    <div>
      <Scanner setCameraResult={setCameraResult} />
      {data && <p>{data.name}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" ref={deviceRef} />
        <button type="submit">Submit Hardware</button>
      </form>

      {equiptmentData && <QrMaker value={equiptmentData.id} />}
    </div>
  );
};

export default CameraPage;
