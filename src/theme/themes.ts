"use client";
import { createTheme, Shadows, ThemeOptions } from "@mui/material/styles";
import blueGrey from "@mui/material/colors/blueGrey";
import blue from "@mui/material/colors/blue";
import grey from "@mui/material/colors/grey";
import green from "@mui/material/colors/green";
// const defaultTheme = createTheme();

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
// const defaultShadows: ThemeOptions["shadows"] = [...defaultTheme.shadows];
export const darkTheme = createTheme({
  // shadows: defaultShadows.map(() => "none") as Shadows,
  typography: {
    button: { textTransform: "none" },
    fontFamily: `"Poppins", "Helvetica", "Arial", sans-serif`,
  },
  palette: {
    primary: {
      main: "#454344", //blueGrey[800],
    },
    secondary: {
      main: "#ed6c02",
      contrastText: "white",
    },
    light: { main: grey[500] },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
        },
      },
    },
  },
});
