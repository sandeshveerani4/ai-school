"use client";
import { Box, Grid, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { use } from "react";
import { getClasses } from "../Classes/GetClasses";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormWithLoading from "../FormWithLoading";
import { getSections } from "../Classes/ClassRow";
import { getTeachers } from "../Teachers/GetTeachers";

const getOptions = (array: any) => {
  return array.map((item: any, index: any) => (
    <MenuItem key={index} value={item.id}>
      {item.name ?? `${item.first_name} ${item.last_name}`}
    </MenuItem>
  ));
};
const CreateSubject = ({
  reloadData,
}: {
  reloadData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [classes, setClasses] = React.useState([]);
  const [teachers, setTeachers] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState(0);
  const [sections, setSections] = React.useState([]);
  const classChange = (event: SelectChangeEvent) => {
    console.log("called");
    setSelectedClass(event.target.value as unknown as number);
  };
  const fields = [
    { label: "Subject Name", name: "name", required: true },
    { label: "Subject Teacher", name: "teacher", select: true, required: true },
    {
      label: "Class",
      name: "class",
      required: true,
      select: true,
      onChange: (e: any) => classChange(e),
    },
    { label: "Section", name: "section", select: true, required: true },
  ];
  React.useEffect(() => {
    (async () => {
      setTeachers(await getTeachers());
      setClasses(await getClasses());
    })();
  }, []);
  React.useEffect(() => {
    if (selectedClass !== 0) {
      (async () => {
        setSections(await getSections(selectedClass));
      })();
    }
  }, [selectedClass]);
  return (
    <FormWithLoading
      submitName="Create Subject"
      endpoint="/api/subjects"
      setDone={reloadData}
    >
      <Grid container rowSpacing={1} columnSpacing={1}>
        {fields.map((item, index) =>
          item.name === "date_of_birth" ? (
            <Grid key={index} item md={6} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ background: "white", width: "100%" }}
                  {...item}
                />
              </LocalizationProvider>
            </Grid>
          ) : (
            <Grid key={index} item md={6} xs={12}>
              <TextField
                sx={{ background: "white" }}
                InputLabelProps={{
                  sx: {
                    textTransform: "capitalize",
                  },
                }}
                {...item}
                fullWidth
              >
                {item.select &&
                  (item.name == "class"
                    ? getOptions(classes)
                    : item.name == "section"
                    ? getOptions(sections)
                    : item.name == "teacher"
                    ? getOptions(teachers)
                    : "")}
              </TextField>
            </Grid>
          )
        )}
      </Grid>
    </FormWithLoading>
  );
};

export default CreateSubject;
