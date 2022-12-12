import React from "react";

import { Button } from "@mui/material";

import { Equipment } from "@prisma/client";

import exportFromJSON from "export-from-json";
import { trpc } from "../utils/trpc";

type Props = {
  filter: {
    status: string;
    condition?: string;
    department?: string;
    serial?: string;
    unchecked: boolean;
  };
};

const ExportButton = ({ filter }: Props) => {
  const { data: equiptment } = trpc.equiptment.all.useQuery(
    {
      status: filter.status,
      condition: filter.condition ? filter.condition : undefined,
      department: filter.department ? filter.department : undefined,
      serial: filter.serial ? filter.serial : undefined,
      unchecked: filter.unchecked,
    },
    { refetchOnWindowFocus: false }
  );

  return (
    <Button
      variant="outlined"
      size="small"
      sx={{
        whiteSpace: "nowrap",
      }}
      onClick={() => {
        const data = equiptment ? equiptment : [];
        const fileName = "download";
        const exportType = exportFromJSON.types.csv;
        if (data.length > 0) {
          const latestData = data.map(({ id, userId, ...exceptId }) => {
            return { ...exceptId };
          });

          exportFromJSON({ data: latestData, fileName, exportType });

          return;
        }

        exportFromJSON({ data, fileName, exportType });
      }}
    >
      Export to Excel
    </Button>
  );
};

export default ExportButton;
