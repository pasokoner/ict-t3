import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#469597",
    },

    info: {
      main: "#d8b974",
    },

    warning: {
      main: "#da8a56",
    },

    error: {
      main: "#96421d",
    },

    regular: {
      white: "#FFFDFA",
    },
  },

  typography: {
    fontFamily: ["Inter", "Roboto"].join(","),
  },
});
