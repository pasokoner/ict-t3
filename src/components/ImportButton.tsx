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
  issuedTo: string;
  usedBy?: string;
  date: string;
}

const ImportButton = () => {
  const { mutate } = trpc.equiptment.import.useMutation();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const data = await file?.arrayBuffer();

        const workbook = XLSX.read(data);

        console.log(workbook);

        workbook.SheetNames.forEach((_, i) => {
          const worksheet = workbook.Sheets[`${workbook.SheetNames[i] as string}`];
          const jsonData = XLSX.utils.sheet_to_json<Equiptment>(worksheet as XLSX.WorkSheet);

          const formattedData = jsonData
            .filter(
              ({ name, oldSerial, newSerial, department, reminder, issuedTo, usedBy, date }) => {
                if (
                  name.trim() &&
                  (oldSerial.trim() || newSerial?.trim()) &&
                  department.trim() &&
                  (issuedTo.trim() || usedBy?.trim()) &&
                  new Date(date.trim()).toString() !== "Invalid Date"
                ) {
                  return true;
                }

                return false;
              }
            )
            .map(({ name, oldSerial, newSerial, department, reminder, issuedTo, usedBy, date }) => {
              return {
                name,
                serial: newSerial ? newSerial : oldSerial,
                department,
                reminder,
                issuedTo,
                usedBy: usedBy ? usedBy : issuedTo,
                date: new Date(date),
              };
            });

          if (formattedData.length > 0) {
            mutate(formattedData);
          }
        });
      }
    }
  };

  return (
    <Button variant="contained" component="label">
      IMPORT
      <input type="file" hidden onChange={handleFile} />
    </Button>
  );
};

export default ImportButton;
