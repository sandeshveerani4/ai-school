"use client";
import { Box, Grid, MenuItem, TextField, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { DatePicker, DateTimeField } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormWithLoading from "../FormWithLoading";
import Dropzone, { useDropzone } from "react-dropzone";
import SearchTopics from "../Topics/SearchTopics";
import { Topic } from "../Topics/GetTopics";
import AttachmentIcon from "@mui/icons-material/Attachment";
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
  const [selectedTopic, setSelectedTopic] = useState<Topic>({} as Topic);
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <Box gap={1} className="mb-2">
        <SearchTopics changeTopic={setSelectedTopic} />
        {selectedTopic.title && (
          <Box className="mt-2">
            <Typography>
              Topic:{" "}
              <Typography component={"span"} fontWeight={"medium"}>
                {selectedTopic.title}
              </Typography>
            </Typography>
            <Typography>
              Subject:{" "}
              <Typography component={"span"} fontWeight={"medium"}>
                {selectedTopic.subject.name}
              </Typography>
            </Typography>
            <Typography>
              Class:{" "}
              <Typography component={"span"} fontWeight={"medium"}>
                {selectedTopic.subject.class.name}
              </Typography>
            </Typography>
            <Typography>
              Section:{" "}
              <Typography component={"span"} fontWeight={"medium"}>
                {selectedTopic.subject.section.name}
              </Typography>
            </Typography>
          </Box>
        )}
      </Box>
      <FormWithLoading
        submitName="Create Assignment"
        endpoint="/api/assignments"
        setDone={reloadData}
      >
        <input
          type="number"
          value={selectedTopic.id ?? ""}
          name="topicId"
          required
          style={{ display: "none" }}
        />
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
            {isDragActive ? (
              "Drop the files here ..."
            ) : (
              <Grid
                direction="column"
                justifyItems={"center"}
                alignItems={"center"}
              >
                <Typography>Add Attachments</Typography>
                <AttachmentIcon />
              </Grid>
            )}
          </Typography>
        </Box>
      </FormWithLoading>
    </>
  );
};

export default CreateAssignment;
