"use client";
import { Grid, TextField, Box, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import { DateField } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormWithLoading from "../FormWithLoading";
import { useRouter } from "next/navigation";
import Add from "@mui/icons-material/Add";

const fields = [
  { label: "First Name", name: "first_name", required: true },
  { label: "Last Name", name: "last_name", required: true },
  { label: "Username", name: "username", required: true },
  { label: "Password", name: "password", required: true, type: "password" },
  { label: "Date of Birth", name: "date_of_birth" },
];
const CreateTeacher = () => {
  const [done, setDone] = useState(false);
  const router = useRouter();
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    if (done) {
      router.refresh();
      setDone(false);
    }
  }, [done]);

  return (
    <>
      <Box overflow={"hidden"}>
        <IconButton onClick={() => setShow(!show)} className="float-right my-2">
          <Add />
        </IconButton>
      </Box>
      {show && (
        <FormWithLoading
          endpoint="/api/teachers"
          submitName="Create Teacher"
          setDone={setDone}
        >
          <Grid container rowSpacing={1} columnSpacing={1}>
            {fields.map((item, index) =>
              item.name === "date_of_birth" ? (
                <Grid key={index} item md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateField
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
      )}
    </>
  );
};

export default CreateTeacher;
