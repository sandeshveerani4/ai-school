"use client";
import { Box, Grid, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { getSession } from "next-auth/react";
import { getClasses, getSections } from "../Classes/GetClasses";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Class } from "@prisma/client";
import { Student } from "./StudentFields";
import FormWithLoading from "../FormWithLoading";

const fields = [
  { label: "First Name", name: "first_name", required: true },
  { label: "Last Name", name: "last_name", required: true },
  { label: "Username", name: "username", required: true },
  { label: "Password", name: "password", required: true, type: "password" },
  { label: "Class", name: "class", required: true, select: true },
  { label: "Section", name: "section", select: true },
  { label: "Date of Birth", name: "date_of_birth" },
];
const getOptions = (array: any) => {
  return array.map((item: any, index: any) => (
    <MenuItem key={index} value={item.id}>
      {item.name}
    </MenuItem>
  ));
};
const CreateStudent = ({
  reloadData,
}: {
  reloadData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState(0);
  const [sections, setSections] = React.useState([]);
  const classChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value as unknown as number);
  };
  React.useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        setClasses(await getClasses(session.user.accessToken));
      }
    })();
  }, []);
  React.useEffect(() => {
    if (selectedClass !== 0) {
      (async () => {
        const session = await getSession();
        if (session) {
          setSections(
            await getSections(session.user.accessToken, selectedClass)
          );
        }
      })();
    }
  }, [classes]);
  return (
    <FormWithLoading
      submitName="Create Student"
      endpoint="/api/students"
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
              >
                {item.select &&
                  (item.name == "class"
                    ? getOptions(classes)
                    : item.name == "section"
                    ? getOptions(sections)
                    : "")}
              </TextField>
            </Grid>
          )
        )}
      </Grid>
    </FormWithLoading>
  );
};

export default CreateStudent;
