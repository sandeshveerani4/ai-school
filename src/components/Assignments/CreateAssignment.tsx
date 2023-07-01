"use client";
import {
  Box,
  Grid,
  MenuItem,
  Select,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { Fragment, useCallback } from "react";
import { getClasses } from "../Classes/GetClasses";
import { DatePicker, DateTimeField } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormWithLoading from "../FormWithLoading";
import { getSections } from "../Classes/ClassRow";
import ModalLay from "../ModalLay";
import ImageIcon from "@mui/icons-material/Image";
import Dropzone, { useDropzone } from "react-dropzone";

const getOptions = (array: any) => {
  return array.map((item: any, index: any) => (
    <MenuItem key={index} value={item.id}>
      {item.name}
    </MenuItem>
  ));
};
const CreateAssignment = ({
  reloadData,
}: {
  reloadData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState(0);
  const [sections, setSections] = React.useState([]);
  const classChange = (event: SelectChangeEvent) => {
    console.log("called");
    setSelectedClass(event.target.value as unknown as number);
  };
  const fields = [
    { label: "Title", name: "title", required: true },
    { label: "Description", name: "description", required: true },
    // { label: "Topic", name: "topic", required: true },
    { label: "Deadline", name: "deadline", required: true },
  ];
  React.useEffect(() => {
    (async () => {
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
  const onDrop = useCallback((acceptedFiles:any) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <FormWithLoading
      submitName="Create Assignment"
      endpoint="/api/assignments"
      setDone={reloadData}
    >
      <Grid container rowSpacing={1} columnSpacing={1}>
        <Grid item width={"100%"}>
          <ModalLay
            buttonTitle="Select Topic"
            buttonProps={{ variant: "contained", color: "secondary" }}
          ></ModalLay>
        </Grid>
        <Grid item width={"100%"}>
          <TextField
            sx={{ background: "white" }}
            InputLabelProps={{
              sx: {
                textTransform: "capitalize",
              },
            }}
            label="Title"
            name="title"
            fullWidth
          ></TextField>
        </Grid>
        <Grid item width={"100%"}>
          <TextField
            sx={{ background: "white" }}
            InputLabelProps={{
              sx: {
                textTransform: "capitalize",
              },
            }}
            label="Description"
            name="description"
            multiline={true}
            minRows={5}
            fullWidth
          ></TextField>
        </Grid>
        <Grid item width={"100%"}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimeField
              sx={{ background: "white", width: "100%" }}
              label="Deadline"
              name="deadline"
              required
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Box
        className={`w-100 ${
          isDragActive ? "bg-neutral-300" : "bg-neutral-200"
        } rounded-lg p-4 py-7 my-2`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Typography
          textAlign={"center"}
          {...(isDragActive && { variant: "h4" })}
          sx={{ userSelect: "none" }}
        >
          {isDragActive
            ? "Drop the files here ..."
            : "Drag n drop some files here, or click to select files"}
        </Typography>
      </Box>
    </FormWithLoading>
  );
};

export default CreateAssignment;
