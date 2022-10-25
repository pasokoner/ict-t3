import { ThemeOptions } from "@mui/material/styles";
import React from "react";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    regular?: {
      white: React.CSSProperties["color"];
    };
  }
}
