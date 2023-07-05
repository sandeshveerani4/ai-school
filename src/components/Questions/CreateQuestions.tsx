"use client";
import {
  Box,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Button,
  CardMedia,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import React, { useCallback, useState, useRef } from "react";
import FormWithLoading from "../FormWithLoading";
import { Topic } from "../Topics/GetTopics";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { fileUpload } from "@/lib/file_upload";
interface Option {
  option: string;
  correct: boolean;
  image?: string;
}
const defaultOption: Option = { option: "", correct: false };

const OptionItem = ({
  value,
  index,
  options,
  setOptions,
}: {
  value: Option;
  index: number;
  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
}) => {
  const inpFile = useRef<HTMLInputElement>(null);
  return (
    <Grid container>
      <Grid item>
        <Checkbox
          {...(value.correct && { selected: true })}
          onChange={(e) =>
            updateValue(options, setOptions, index, {
              correct: e.target.checked,
            })
          }
        />
      </Grid>
      <Grid flexGrow={1} item>
        <TextField
          label="Option"
          size="small"
          value={value.option}
          onChange={(e) =>
            updateValue(options, setOptions, index, { option: e.target.value })
          }
          fullWidth
        />
      </Grid>
      <Grid item>
        <input
          type="file"
          ref={inpFile}
          onChange={(e) =>
            e.target.files &&
            updateValue(options, setOptions, index, {
              image: e.target.files[0],
            })
          }
          style={{ display: "none" }}
        />
        <Tooltip title="Attach Image">
          <IconButton onClick={() => inpFile.current?.click()}>
            <AttachmentIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Delete Option"
          onClick={() =>
            options.length != 1 &&
            setOptions(options.filter((val, ind) => ind != index))
          }
        >
          <IconButton>
            <Delete />
          </IconButton>
        </Tooltip>
        <IconButton
          title="Add new Option"
          onClick={() => {
            index === options.length - 1
              ? setOptions([...options, defaultOption])
              : setOptions(
                  options
                    .slice(0, index + 1)
                    .concat([defaultOption])
                    .concat(options.slice(index + 1))
                );
          }}
        >
          <Add />
        </IconButton>
      </Grid>
    </Grid>
  );
};
const updateValue = (
  options: Option[],
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>,
  index: number,
  newOpt: object
) => {
  const newOptions = options.slice();
  newOptions[index] = { ...options[index], ...newOpt };
  setOptions(newOptions);
};
const CreateQuestions = ({
  reloadData,
}: {
  reloadData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);
  const [image, setImage] = useState<any>(undefined);
  const [options, setOptions] = useState<Option[]>([defaultOption]);
  const inputFile = useRef<HTMLInputElement>(null);

  const middleware = async () => {
    const optionsC = options.slice();
    for (let index = 0; index < optionsC.length; index++) {
      const element = optionsC[index];
      if (element.image) {
        try {
          element.image = (await fileUpload(element.image))?.filename;
        } catch {
          element.image = "";
        }
      }
    }
    const payload = { options: optionsC, image: "" };
    if (image) {
      try {
        payload.image = (await fileUpload(image))?.filename;
      } catch {}
    }
    return payload;
  };
  return (
    <>
      <input
        type="file"
        ref={inputFile}
        onChange={(e) => e.target.files && setImage(e.target.files[0])}
        style={{ display: "none" }}
      />
      <FormWithLoading
        submitName="Create Question"
        endpoint="/api/questions"
        middleware={middleware}
        setDone={reloadData}
      >
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid item lg={6} md={12}>
            <TextField
              sx={{ background: "white" }}
              InputLabelProps={{
                sx: {
                  textTransform: "capitalize",
                },
              }}
              label="Question"
              name="question"
              multiline
              required
              fullWidth
            ></TextField>
          </Grid>
          <Grid item lg={6} md={12}>
            <TextField
              sx={{ background: "white" }}
              InputLabelProps={{
                sx: {
                  textTransform: "capitalize",
                },
              }}
              label="Score"
              name="score"
              type="number"
              inputProps={{ min: "0" }}
              required
              fullWidth
            ></TextField>
          </Grid>
          {image && (
            <Box width="100%">
              <Box height={"200px"}>
                <CardMedia
                  component="img"
                  sx={{
                    height: "100%",
                    width: "auto",
                  }}
                  src={URL.createObjectURL(image)}
                />
              </Box>
            </Box>
          )}
          <Button
            startIcon={<AttachmentIcon />}
            onClick={() => inputFile.current?.click()}
          >
            {image ? "Change" : "Attach"} Image
          </Button>
          <Typography width={"100%"}>Correct</Typography>
          {options.map((value, index) => (
            <OptionItem
              key={index}
              index={index}
              value={value}
              options={options}
              setOptions={setOptions}
            />
          ))}
        </Grid>
      </FormWithLoading>
    </>
  );
};

export default CreateQuestions;
