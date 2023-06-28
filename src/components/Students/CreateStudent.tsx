"use client";
import { Box, Grid, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import React from "react";
import Button from "@mui/material/Button";
import { getSession } from "next-auth/react";
import { Class, getClasses, getSections } from "../Classes/GetClasses";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const fields = [
  { label: "First Name", name: "first_name", required: true },
  { label: "Last Name", name: "last_name", required: true },
  { label: "Username", name: "username", required: true },
  { label: "Password", name: "password", required: true },
  { label: "Class", name: "class", required: true },
  { label: "Section", name: "section" },
  { label: "Date of Birth", name: "date_of_birth" },
];
const CreateStudent = () => {
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
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const session = await getSession();
    const formData = new FormData(e.target);
    const value = Object.fromEntries(formData.entries());
    const JSONdata = JSON.stringify(value);
    const endpoint = `/api/students`;
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
          item.name === "class" ? (
            <Grid key={index} item md={6}>
              <Select
                sx={{ background: "white" }}
                onChange={classChange}
                {...item}
                fullWidth
              >
                {classes.map((item: Class) => (
                  <MenuItem value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </Grid>
          ) : item.name === "date_of_birth" ? (
            <Grid key={index} item md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ background: "white", width: "100%" }}
                  {...item}
                />
              </LocalizationProvider>
            </Grid>
          ) : item.name === "section" ? (
            <Grid key={index} item md={6}>
              <Select sx={{ background: "white" }} {...item} fullWidth>
                {sections.map((item: Class) => (
                  <MenuItem value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
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
        Create Student
      </Button>
    </Box>
  );
};

export default CreateStudent;
