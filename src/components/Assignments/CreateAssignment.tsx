"use client";
import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Button,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { DatePicker, DateTimeField } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormWithLoading from "../FormWithLoading";
import Dropzone, { useDropzone } from "react-dropzone";
import SearchTopics from "../Topics/SearchTopics";
import { Topic } from "../Topics/GetTopics";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Delete from "@mui/icons-material/Delete";
import SearchQuestions from "../Questions/SearchQuestions";
import { Question } from "../Questions/GetQuestions";
import { fileUpload } from "@/lib/file_upload";
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
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((droppedFiles: File[]) => {
    setFiles(droppedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [selectedMode, setMode] = useState("HOMEWORK");
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [opener, setOpener] = useState(false);
  const middleware = async () => {
    const filenames = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      try {
        const filename = (await fileUpload(element))?.filename;
        filenames.push({ name: element.name, file: filename });
      } catch {}
    }
    return { files: filenames, questions: selectedQuestions };
  };
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
      <SearchQuestions
        selectedQuestions={selectedQuestions}
        changeQuestions={setSelectedQuestions}
        opener={opener}
        setOpener={setOpener}
      />
      <FormWithLoading
        submitName="Create Assignment"
        endpoint="/api/assignments"
        middleware={middleware}
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
          <Grid item lg={6} md={12} width={"100%"}>
            <FormLabel id="visibility">Visibility</FormLabel>
            <RadioGroup
              row
              aria-labelledby="visibility"
              name="Visibility"
              defaultValue={"1"}
            >
              <FormControlLabel value="1" control={<Radio />} label="Visible" />
              <FormControlLabel value="0" control={<Radio />} label="Hidden" />
            </RadioGroup>
          </Grid>
          <Grid item lg={6} md={12} width={"100%"}>
            <FormLabel id="enabled">Enabled</FormLabel>
            <RadioGroup
              row
              aria-labelledby="enabled"
              name="enabled"
              defaultValue={"1"}
            >
              <FormControlLabel value="1" control={<Radio />} label="Enabled" />
              <FormControlLabel
                value="0"
                control={<Radio />}
                label="Disabled"
              />
            </RadioGroup>
          </Grid>
          <Grid item lg={6} md={12} width={"100%"}>
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
          <Grid item lg={6} md={12} width={"100%"}>
            <FormLabel id="type">Type</FormLabel>
            <RadioGroup
              row
              aria-labelledby="type"
              name="type"
              defaultValue={selectedMode}
              onChange={(e) => setMode(e.target.value)}
            >
              <FormControlLabel
                value="HOMEWORK"
                control={<Radio />}
                label="Homework"
              />
              <FormControlLabel value="QUIZ" control={<Radio />} label="Quiz" />
            </RadioGroup>
          </Grid>
          {selectedMode === "QUIZ" && (
            <Box width={"100%"}>
              <Button variant="contained" onClick={() => setOpener(true)}>
                Select Questions
              </Button>{" "}
              {selectedQuestions.length} Questions selected
            </Box>
          )}
          <Grid item lg={6} md={12} width={"100%"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimeField
                sx={{ background: "white", width: "100%" }}
                label="Deadline"
                name="deadline"
                required
              />
            </LocalizationProvider>
          </Grid>
          <Grid item lg={6} md={12} width={"100%"}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimeField
                sx={{ background: "white", width: "100%" }}
                label="Starts on (Empty for Current time)"
                name="willStartAt"
              />
            </LocalizationProvider>
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
          } rounded-2xl p-4 py-5 my-2`}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Box
            textAlign={"center"}
            {...(isDragActive && { variant: "h4" })}
            sx={{ userSelect: "none" }}
          >
            {files.length !== 0 ? (
              <Grid
                container
                direction="row"
                gap={2}
                justifyItems={"center"}
                alignItems={"flex-start"}
              >
                {files.map((file, index) => (
                  <Grid
                    container
                    justifyContent={"center"}
                    alignItems={"center"}
                    key={index}
                    height={100}
                    className="bg-neutral-50 rounded-2xl"
                    item
                  >
                    <Typography fontWeight={"medium"} component="span">
                      {file.name}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid
                container
                direction="column"
                justifyItems={"center"}
                alignItems={"center"}
              >
                <Typography component="span">Attach Files</Typography>
                <AttachmentIcon />
              </Grid>
            )}
          </Box>
        </Box>
      </FormWithLoading>
    </>
  );
};

export default CreateAssignment;
