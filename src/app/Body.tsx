"use client";
import React from "react";
import { darkTheme } from "../theme/themes";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import Loading from "./dashboard/loading";
export default function Body({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <body style={{ backgroundColor: "#f9f8fd" }}>
        <React.Suspense
          fallback={
            <Box
              className="w-100 flex flex-row item-center justify-center"
              sx={{ height: "100vh" }}
            >
              <Loading size={40} />
            </Box>
          }
        >
          {children}
        </React.Suspense>
      </body>
    </ThemeProvider>
  );
}
