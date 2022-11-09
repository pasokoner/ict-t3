import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#131B4F",
    },

    info: {
      main: "#e3d100",
    },

    regular: {
      white: "#FFFDFA",
    },
  },

  typography: {
    fontFamily: ["Inter", "Roboto"].join(","),
  },
});
