import React from "react";

import { Button } from "@mui/material";

import * as XLSX from "xlsx";
import { trpc } from "../utils/trpc";

interface Equiptment {
  name: string;
  oldSerial: string;
  newSerial?: string;
  department: string;
  reminder?: string;
  issuedTo?: string;
  usedBy?: string;
  currentUser?: string;
  date: string;
  acquisitionDate: string;
}

const ImportButton = () => {
  const { mutate } = trpc.equiptment.import.useMutation();

  const { mutate: resetEquiptment } = trpc.equiptment.reset.useMutation();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const data = await file?.arrayBuffer();

        const workbook = XLSX.read(data);

        workbook.SheetNames.forEach((_, i) => {
          const worksheet = workbook.Sheets[`${workbook.SheetNames[i] as string}`];
          const jsonData = XLSX.utils.sheet_to_json<Equiptment>(worksheet as XLSX.WorkSheet);

          const formattedData = jsonData
            .filter(({ name }) => {
              return name && name.trim().length > 1;
            })
            .map(
              ({
                name,
                oldSerial,
                newSerial,
                department,
                reminder,
                issuedTo,
                usedBy,
                date,
                currentUser,
                acquisitionDate,
              }) => {
                return {
                  name,
                  serial: newSerial ? newSerial : oldSerial ? oldSerial : "INVALID DATA",
                  department: department ? department : "INVALID DATA",
                  reminder: reminder ? reminder.toString() : null,
                  issuedTo: issuedTo ? issuedTo : null,
                  usedBy:
                    usedBy && currentUser
                      ? usedBy + " " + currentUser
                      : usedBy
                      ? usedBy
                      : currentUser
                      ? currentUser
                      : null,
                  date:
                    new Date(date).toString() !== "Invalid Date"
                      ? new Date(date)
                      : new Date(acquisitionDate).toString() !== "Invalid Date"
                      ? new Date(acquisitionDate)
                      : new Date(0),
                };
              }
            );
          // console.log(jsonData);
          console.log(formattedData);

          if (formattedData.length > 0) {
            mutate(formattedData);
          }
        });
      }
    }
  };

  return (
    <>
      <Button variant="contained" component="label">
        IMPORT
        <input type="file" hidden onChange={handleFile} />
      </Button>
      <Button
        onClick={() => {
          resetEquiptment();
        }}
      >
        Reset
      </Button>
    </>
  );
};

export default ImportButton;
