"use client";
import { Grid, TextField } from "@mui/material";
import React from "react";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormWithLoading from "../FormWithLoading";

const fields = [
  { label: "First Name", name: "first_name", required: true },
  { label: "Last Name", name: "last_name", required: true },
  { label: "Username", name: "username", required: true },
  { label: "Password", name: "password", required: true, type: "password" },
  { label: "Date of Birth", name: "date_of_birth" },
];
const CreateTeacher = ({
  reloadData,
}: {
  reloadData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <FormWithLoading
      endpoint="/api/teachers"
      submitName="Create Teacher"
      setDone={reloadData}
    >
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
    </FormWithLoading>
  );
};

export default CreateTeacher;
