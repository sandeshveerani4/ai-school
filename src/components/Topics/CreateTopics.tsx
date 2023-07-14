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
import React, { Fragment, useCallback, useEffect, useState } from "react";
import FormWithLoading from "../FormWithLoading";
import Dropzone, { useDropzone } from "react-dropzone";
import { Class } from "../Classes/ClassRow";
import { Section } from "@prisma/client";
import { useRouter } from "next/navigation";

const getOptions = (array: any) => {
  return array.map((item: any, index: any) => (
    <MenuItem key={index} value={item.id}>
      {item.name}
    </MenuItem>
  ));
};
const CreateTopic = ({ subjectId }: { subjectId: number }) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });
  const [done, setDone] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (done) router.refresh();
  }, [done]);
  return (
    <FormWithLoading
      submitName="Create Topic"
      endpoint={`/api/subjects/${subjectId}/topics`}
      setDone={setDone}
    >
      <Grid container rowSpacing={1} columnSpacing={1}>
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
            required
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
          {isDragActive ? "Drop the file here." : "Choose Featured Image"}
        </Typography>
      </Box>
    </FormWithLoading>
  );
};

export default CreateTopic;
