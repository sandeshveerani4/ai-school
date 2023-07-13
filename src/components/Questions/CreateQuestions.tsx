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
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useCallback, useState, useRef, useEffect } from "react";
import FormWithLoading from "../FormWithLoading";
import { Topic } from "../Topics/GetTopics";
import AttachmentIcon from "@mui/icons-material/Attachment";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import { fileUpload } from "@/lib/file_upload";
import SearchTopics from "../Topics/SearchTopics";
import BulkImport from "../Students/BulkImport";
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
  correct,
  setCorrect,
}: {
  value: Option;
  index: number;
  options: Option[];
  correct: number;
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
  setCorrect: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const inpFile = useRef<HTMLInputElement>(null);
  return (
    <Grid container>
      <Grid item>
        <Radio checked={correct === index} onChange={() => setCorrect(index)} />
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
        <Tooltip title="Add new Option">
          <IconButton
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
        </Tooltip>
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
const CreateQuestions = () => {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);
  const [image, setImage] = useState<any>(undefined);
  const [options, setOptions] = useState<Option[]>([defaultOption]);
  const inputFile = useRef<HTMLInputElement>(null);

  const [selectedTopic, setSelectedTopic] = useState<Topic>({} as Topic);
  const [selectedType, setSelectedType] = useState("MCQ");
  const [correct, setCorrect] = useState(0);
  const middleware = async () => {
    const payload = { options: [] as Option[], image: "" };
    if (selectedType === "MCQ") {
      const optionsC = options.slice();
      for (let index = 0; index < optionsC.length; index++) {
        const element = optionsC[index];
        if (index === correct) {
          element.correct = true;
        }
        if (element.image) {
          try {
            element.image = (await fileUpload(element.image))?.filename;
          } catch {
            element.image = "";
          }
        }
      }
      payload.options = optionsC;
    }
    if (image) {
      try {
        payload.image = (await fileUpload(image))?.filename;
      } catch {}
    }
    return payload;
  };
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) {
    }
  }, [done]);
  const [show, setShow] = React.useState(false);
  const [topic, changeTopic] = React.useState<Topic>({} as Topic);
  const middlewareBulk = async () => {
    if (topic) return { topicId: topic.id };
    throw new Error("Please provide topic");
  };
  return (
    <>
      <Box overflow={"hidden"}>
        <BulkImport
          endpoint="/api/questions/bulkimport"
          middleware={middlewareBulk}
          subText="Headings should be named: question, option_A, option_B, option_C,
          option_D, correct,score"
        >
          <SearchTopics changeTopic={changeTopic} />{" "}
          {topic.id && `Selected topic: ${topic.id}`}
        </BulkImport>
        <IconButton onClick={() => setShow(!show)} className="float-right my-2">
          <Add />
        </IconButton>
      </Box>
      {show && (
        <>
          <input
            type="file"
            ref={inputFile}
            onChange={(e) => e.target.files && setImage(e.target.files[0])}
            style={{ display: "none" }}
          />
          <Box gap={1} className="mb-2">
            <SearchTopics changeTopic={setSelectedTopic} />
          </Box>
          <FormWithLoading
            submitName="Create Question"
            endpoint="/api/questions"
            middleware={middleware}
            setDone={setDone}
          >
            <input
              type="number"
              value={selectedTopic.id ?? ""}
              name="topicId"
              required
              style={{ display: "none" }}
            />
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
                  defaultValue={1}
                  required
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item lg={6} md={12}>
                <FormLabel id="type">Type</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="type"
                  name="type"
                  defaultValue={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <FormControlLabel
                    value="MCQ"
                    control={<Radio />}
                    label="MCQ"
                  />
                  <FormControlLabel
                    value="FILL"
                    control={<Radio />}
                    label="Fill in the blank"
                  />
                </RadioGroup>
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
              <Grid item xs={12}>
                <Typography width={"100%"}>Correct</Typography>
                <RadioGroup>
                  {selectedType === "MCQ" ? (
                    options.map((value, index) => (
                      <OptionItem
                        key={index}
                        index={index}
                        value={value}
                        correct={correct}
                        setCorrect={setCorrect}
                        options={options}
                        setOptions={setOptions}
                      />
                    ))
                  ) : (
                    <TextField
                      label="Correct Answer"
                      sx={{ background: "white" }}
                      name="fill"
                      required
                      fullWidth
                      InputLabelProps={{
                        sx: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  )}
                </RadioGroup>
              </Grid>
            </Grid>
          </FormWithLoading>
        </>
      )}
    </>
  );
};

export default CreateQuestions;
