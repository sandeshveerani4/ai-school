"use client";
import { Grid, TextField } from "@mui/material";
import React from "react";
import FormWithLoading from "../FormWithLoading";
const fields = [
  { label: "Class Name", name: "name", required: true },
  { label: "Rank", name: "rank", type: "number", required: true },
  { label: "Class Teacher" },
];
const CreateClass = ({
  reloadData,
}: {
  reloadData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <FormWithLoading
      submitName="Create Class"
      endpoint="/api/classes"
      setDone={reloadData}
    >
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
    </FormWithLoading>
  );
};

export default CreateClass;
