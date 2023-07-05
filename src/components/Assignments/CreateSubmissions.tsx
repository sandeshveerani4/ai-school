"use client";
import { Box, Grid, TextField, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import FormWithLoading from "../FormWithLoading";
import Dropzone, { useDropzone } from "react-dropzone";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { fileUpload } from "@/lib/file_upload";

const CreateSubmissions = ({
  assignmentId,
  reloadData,
}: {
  assignmentId: string;
  reloadData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((droppedFiles: File[]) => {
    setFiles(droppedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const middleware = async () => {
    const filenames = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      try {
        const filename = (await fileUpload(element))?.filename;
        filenames.push({ name: element.name, file: filename });
      } catch {}
    }
    return { files: filenames };
  };
  return (
    <>
      <FormWithLoading
        submitName="Submit Assignment"
        buttonProps={{ variant: "outlined" }}
        endpoint={`/api/assignments/${assignmentId}/submissions`}
        middleware={middleware}
        setDone={reloadData}
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

export default CreateSubmissions;
