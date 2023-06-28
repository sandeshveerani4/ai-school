"use client";
import { Box, Grid, TextField } from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";
import { getSession } from "next-auth/react";
import { config } from "@/consts";
const fields = [
  { label: "Class Name", name: "name", required: true },
  { label: "Rank", name: "rank", type: "number", required: true },
  { label: "Class Teacher" },
];
const CreateClass = () => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const session = await getSession();
    const data = {
      name: e.target.name.value,
      rank: Number(e.target.rank.value),
    };
    const JSONdata = JSON.stringify(data);
    const endpoint = `/api/classes`;
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: session?.user.accessToken ?? "",
      },
      body: JSONdata,
      cache: "no-store",
    };
    const response = await fetch(endpoint, options);
    const result = await response.json();
    console.log(result);
  };
  return (
    <Box component={"form"} onSubmit={handleSubmit}>
      <Grid container rowSpacing={1} columnSpacing={1}>
        {fields.map((value, index) => (
          <Grid key={index} item md={6}>
            <TextField
              sx={{ background: "white" }}
              InputLabelProps={{
                sx: {
                  textTransform: "capitalize",
                },
              }}
              {...value}
              fullWidth
            ></TextField>
          </Grid>
        ))}
      </Grid>
      <Button type="submit" className="my-2" variant="contained">
        Create Class
      </Button>
    </Box>
  );
};

export default CreateClass;
