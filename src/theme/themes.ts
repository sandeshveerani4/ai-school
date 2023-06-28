"use client";
import { createTheme, ThemeOptions, Shadows } from "@mui/material/styles";
import blueGrey from "@mui/material/colors/blueGrey";
import grey from "@mui/material/colors/grey";
import green from "@mui/material/colors/green";
// create a temporary theme to get the default options
const defaultTheme = createTheme();

declare module "@mui/material/styles" {
  interface Palette {
    light: Palette["primary"];
  }

  interface PaletteOptions {
    light?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button/Button" {
  interface ButtonPropsColorOverrides {
    light: true;
  }
}
// get the default `shadows` object
const defaultShadows: ThemeOptions["shadows"] = [...defaultTheme.shadows];
export const darkTheme = createTheme({
  shadows: defaultShadows.map(() => "none") as Shadows,
  typography: {
    button: { textTransform: "none" },
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
  },
  palette: {
    primary: {
      main: blueGrey[800],
    },
    secondary: {
      main: green[500],
      contrastText: "white",
    },
    light: { main: grey[600] },
  },
});
