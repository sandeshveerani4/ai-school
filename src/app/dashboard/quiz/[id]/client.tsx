"use client";
import FormWithLoading from "@/components/FormWithLoading";
import ModalLay from "@/components/ModalLay";
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
import CheckIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
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
  const [value, setValue] = useState("");
  useEffect(() => {
    if (questions[question.id]) {
      setValue(questions[question.id]);
    } else {
      setValue("");
    }
  }, [questions, question.id]);
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
          value={value}
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
              control={<Radio checked={item.id === (value as any)} />}
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
const Client = ({ quiz }: { quiz: Quiz }) => {
  const [chosenQuestions, setQuestions] = useState<any>({});
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const getTime = () => {
    const time = new Date(quiz.deadline).getTime() - Date.now();

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
  const { push, refresh } = useRouter();
  /* useEffect(() => {
    if (done) {
      refresh();
      push(`/dashboard/assignments/${quiz.id}`);
    }
  }, [done]); */
  const [currentQuestion, setCurrent] = useState(0);
  const [data, setData] = useState<{
    score: number;
    count: number;
    xp: number;
    questions: any;
  }>({
    score: 0,
    count: 0,
    xp: 0,
    questions: [],
  });
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (done && data) setOpen(true);
  }, [data]);

  return (
    <>
      <ModalLay
        opener={open}
        setOpener={setOpen}
        isButton={false}
        onClose={() => {
          refresh();
          push(`/dashboard/assignments/${quiz.id}`);
        }}
      >
        <Typography variant="h6" component="h2">
          Results
        </Typography>
        <Box>Score: {data.score}</Box>
        <Box>Correct:{data.count / quiz.questions.length}</Box>
        <Box>
          Accuracy:{((data.count / quiz.questions.length) * 100).toFixed(2)}
        </Box>
        <Box>XP increased:{data.xp}</Box>
        <Box>
          <Typography variant="h6">Questions</Typography>
          {data.questions.length !== 0 &&
            data.questions.map((question: any, index: number) => (
              <Box key={question.question.id}>
                <Typography fontWeight={600}>
                  {index + 1}. {question.question.question}
                </Typography>
                <Grid
                  container
                  alignItems={"center"}
                  justifyContent={"center"}
                  width={"32px"}
                  height={"32px"}
                  bgcolor={
                    question.question.right ? "success.main" : "error.main"
                  }
                  className="rounded-full"
                >
                  {question.question.right ? (
                    <CheckIcon className="text-white" />
                  ) : (
                    <ClearOutlinedIcon className="text-white" />
                  )}
                </Grid>{" "}
                Correct Answer:{" "}
                {question.question.type == "FILL"
                  ? question.question.fill
                  : question.question.options[0].option}
              </Box>
            ))}
        </Box>
      </ModalLay>
      <FormWithLoading
        endpoint={`/api/assignments/${quiz.id}/quiz`}
        submitName="Submit Quiz"
        setDone={setDone}
        data={chosenQuestions}
        button={false}
        setData={setData}
      >
        <Grid container gap={2} direction={"row"} className="pb-4">
          <Grid item xs={12}>
            <Typography fontWeight={700} variant="h5">
              {quiz.title}
            </Typography>
            <Box className="bg-neutral-200 my-2 p-3 rounded-lg inline-block">
              <Box>
                <Typography color={"CaptionText"} variant="caption">
                  Ends at:
                </Typography>
                <Typography variant="subtitle1" color="black">
                  {new Date(quiz.deadline).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography color={"CaptionText"} variant="caption">
                  Remaining Time:
                </Typography>
                <Typography variant="subtitle1" color="black">
                  {days !== 0 && `${days}d `} {hours !== 0 && `${hours}h`}{" "}
                  {`${minutes}m`} {`${seconds}s`}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid container direction="column">
            <Grid item>
              <Question
                key={currentQuestion}
                question={quiz.questions[currentQuestion].question}
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
              {quiz.questions.length !== currentQuestion + 1 ? (
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
    </>
  );
};

export default Client;
