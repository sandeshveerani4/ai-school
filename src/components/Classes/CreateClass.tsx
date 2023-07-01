"use client";
import { Grid, MenuItem, TextField } from "@mui/material";
import React from "react";
import FormWithLoading from "../FormWithLoading";
import { getTeachers } from "../Teachers/GetTeachers";
const fields = [
  { label: "Class Name", name: "name", required: true },
  { label: "Rank", name: "rank", type: "number", required: true },
  { label: "Class Teacher", select: true, name: "teacher", required: true },
];
const getOptions = (array: any) => {
  return array.map((item: any, index: any) => (
    <MenuItem key={index} value={item.id}>
      {item.first_name} {item.last_name} #{item.id}
    </MenuItem>
  ));
};
const CreateClass = ({
  reloadData,
}: {
  reloadData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [teachers, setTeachers] = React.useState([]);
  React.useEffect(() => {
    (async () => {
      setTeachers(await getTeachers());
    })();
  }, []);
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
            >
              {value.select && value.name == "teacher" && getOptions(teachers)}
            </TextField>
          </Grid>
        ))}
      </Grid>
    </FormWithLoading>
  );
};

export default CreateClass;
