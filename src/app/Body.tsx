"use client";
import React from "react";
import { darkTheme } from "../theme/themes";
import { ThemeProvider, CssBaseline } from "@mui/material";
export default function Body({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <body style={{ backgroundColor: "#f9f8fd" }}>{children}</body>
    </ThemeProvider>
  );
}
