"use client";
import { config } from "@/consts";
import { Button, Grid, Stack } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <Grid
      container
      height="100vh"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <h1>{config.site.name}</h1>
      <Stack direction="row" columnGap={1}>
        <Button
          variant="contained"
          color="secondary"
          LinkComponent={Link}
          href="/login"
        >
          Login
        </Button>
      </Stack>
    </Grid>
  );
}
