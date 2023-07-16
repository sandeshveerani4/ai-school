"use client";
import FormWithLoading from "@/components/FormWithLoading";
import { Question } from "@/components/Questions/GetQuestions";
import { inputWhite } from "@/components/Students/StudentFields";
import { config } from "@/lib/consts";
import {
  Box,
  Button,
  CardMedia,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
export type Quiz = Prisma.AssignmentGetPayload<{
  include: {
    questions: {
      include: {
        question: {
          include: {
            options: { select: { id: true; option: true; image: true } };
          };
        };
      };
    };
  };
}>;
export type QuestionType = Prisma.QuestionGetPayload<{
  include: { options: { select: { id: true; option: true; image: true } } };
}>;
const Question = ({
  question,
  index,
  questions,
  handleChange,
}: {
  question: QuestionType;
  index: number;
  questions: any;
  handleChange: ({ id, val }: { id: number; val: number | string }) => void;
}) => {
  const [value, setValue] = useState(undefined);
  useEffect(() => {
    if (questions[question.id]) {
      setValue(questions[question.id]);
    }
  }, [questions]);
  return (
    <Grid item xs={12}>
      <Typography fontSize="medium" fontWeight={"medium"}>
        {index + 1}. {question.question}
      </Typography>
      <Box>
        {question.image && (
          <Box width={"200px"}>
            <CardMedia
              component="img"
              sx={{
                width: "100%",
              }}
              src={config.site.imageDomain + question.image}
            />
          </Box>
        )}
      </Box>
      {question.type === "FILL" ? (
        <TextField
          size="small"
          className="my-1"
          label="Fill in the blank"
          sx={inputWhite}
          key={question.id}
          value={value ?? ""}
          onChange={(e) =>
            handleChange({ id: question.id, val: e.target.value })
          }
          fullWidth
        />
      ) : question.options.length === 0 ? (
        "No Options Found"
      ) : (
        <RadioGroup
          className="mt-2"
          onChange={(e) =>
            handleChange({ id: question.id, val: Number(e.target.value) })
          }
        >
          {question.options.map((item, index) => (
            <FormControlLabel
              className="bg-white mb-2 rounded-3xl"
              key={index}
              value={item.id}
              control={<Radio checked={item.id === value} />}
              label={
                <Box>
                  {item.option}
                  {item.image && (
                    <Box width={"200px"}>
                      <CardMedia
                        component="img"
                        sx={{
                          width: "100%",
                        }}
                        src={config.site.imageDomain + item.image}
                      />
                    </Box>
                  )}
                </Box>
              }
            />
          ))}
        </RadioGroup>
      )}
    </Grid>
  );
};
const Client = ({
  questions,
  topicId,
}: {
  questions: Question[];
  topicId: number;
}) => {
  const [chosenQuestions, setQuestions] = useState<any>({});
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const thirtyfor = new Date().getTime() + questions.length * 60 * 1000;
  const getTime = () => {
    const time = new Date(thirtyfor).getTime() - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };
  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, []);
  const handleChange = ({ id, val }: { id: number; val: number | string }) => {
    setQuestions({ ...chosenQuestions, [id]: val });
  };
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) {
      setDone(false);
    }
  }, [done]);
  const [currentQuestion, setCurrent] = useState(0);
  const [data, setData] = useState<{ score: number; count: number }>({
    score: 0,
    count: 0,
  });
  useEffect(() => {
    if (done && data)
      alert(
        `Score: ${data.score}\nCorrect:${data.count}/${
          questions.length
        }\nAccuracy:${((data.count / questions.length) * 100).toFixed(2)}`
      );
  }, [data]);
  return (
    <FormWithLoading
      endpoint={`/api/topics/${topicId}/practise/`}
      submitName="Submit Quiz"
      setDone={setDone}
      data={chosenQuestions}
      button={false}
      setData={setData}
    >
      <Grid container gap={2} direction={"row"} className="pb-4">
        <Grid item xs={12}>
          <Typography fontWeight={500} variant="h5">
            Practise Test
          </Typography>
          <Typography fontWeight={"medium"}>
            Remaining Time: {days !== 0 && `${days}d `}{" "}
            {hours !== 0 && `${hours}h`} {`${minutes}m`} {`${seconds}s`}
          </Typography>
        </Grid>
        <Grid container direction="column">
          <Grid item>
            <Question
              key={currentQuestion}
              question={questions[currentQuestion]}
              index={currentQuestion}
              handleChange={handleChange}
              questions={chosenQuestions}
            />
          </Grid>
          <Box className="py-2 overflow-hidden">
            {currentQuestion !== 0 && (
              <Button
                name="previous"
                variant="outlined"
                color="secondary"
                type="button"
                onClick={() => {
                  setCurrent(currentQuestion - 1);
                }}
              >
                Previous
              </Button>
            )}
            {questions.length !== currentQuestion + 1 ? (
              <Button
                key="next"
                className="float-right"
                variant="outlined"
                color="secondary"
                type="button"
                onClick={() => {
                  setCurrent(currentQuestion + 1);
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                key="submit"
                className="float-right"
                variant="contained"
                color="secondary"
                type="submit"
              >
                Submit Quiz
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </FormWithLoading>
  );
};

export default Client;
