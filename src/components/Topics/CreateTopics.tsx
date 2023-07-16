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
    if (done) {
      router.refresh();
      setDone(false);
    }
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
    </FormWithLoading>
  );
};

export default CreateTopic;
