"use client";
import { Box, Grid, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import Button from "@mui/material/Button";
import { getSession } from "next-auth/react";
import { getClasses, getSections } from "../Classes/GetClasses";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Class } from "@prisma/client";

const fields = [
  { label: "First Name", name: "first_name", required: true },
  { label: "Last Name", name: "last_name", required: true },
  { label: "Username", name: "username", required: true },
  { label: "Password", name: "password", required: true },
  { label: "Date of Birth", name: "date_of_birth" },
];
const CreateTeacher = () => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const session = await getSession();
    const formData = new FormData(e.target);
    const value = Object.fromEntries(formData.entries());
    const JSONdata = JSON.stringify(value);
    const endpoint = `/api/teachers`;
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
  };
  return (
    <Box component={"form"} onSubmit={handleSubmit}>
      <Grid container rowSpacing={1} columnSpacing={1}>
        {fields.map((item, index) =>
          item.name === "date_of_birth" ? (
            <Grid key={index} item md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ background: "white", width: "100%" }}
                  {...item}
                />
              </LocalizationProvider>
            </Grid>
          ) : (
            <Grid key={index} item md={6}>
              <TextField
                sx={{ background: "white" }}
                InputLabelProps={{
                  sx: {
                    textTransform: "capitalize",
                  },
                }}
                {...item}
                fullWidth
              ></TextField>
            </Grid>
          )
        )}
      </Grid>
      <Button type="submit" className="my-2" variant="contained">
        Create Teacher
      </Button>
    </Box>
  );
};

export default CreateTeacher;
