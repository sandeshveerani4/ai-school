"use client";
import { config } from "@/consts";
import { Button, Grid, Stack } from "@mui/material";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <Grid
      container
      height="100vh"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <h1>Welcome.</h1>
      <Stack direction="row" columnGap={1}>
        <Button variant="contained" onClick={() => signIn()}>
          Students Portal
        </Button>
        <Button variant="outlined">Admin Portal</Button>
        <Button variant="outlined">Teachers Portal</Button>
      </Stack>
    </Grid>
  );
}
