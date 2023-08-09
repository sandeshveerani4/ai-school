"use client";
import FormWithLoading from "@/components/FormWithLoading";
import ModalLay from "@/components/ModalLay";
import { Question } from "@/components/Questions/GetQuestions";
import { inputWhite } from "@/components/Students/StudentFields";
import { config, reqParams } from "@/lib/consts";
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

import CheckIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import Loading from "../../loading";
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
export const getQuestions = async (topicId: number, ai = false) => {
  const options: RequestInit = await reqParams();
  const res = await fetch(
    `${config.site.url}/api/topics/${topicId}/practise?ai=${
      ai ? "true" : "false"
    }`,
    options
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const Client = ({ isAi, topicId }: { isAi: boolean; topicId: number }) => {
  const [questions, setInitQuestions] = useState<Question[]>([]);
  useEffect(() => {
    (async () => {
      const qs = await getQuestions(topicId, isAi);
      setInitQuestions(qs);
      const thirtyfor = new Date().getTime() + qs.length * 60 * 1000;
      const interval = setInterval(() => getTime(thirtyfor), 1000);

      return () => clearInterval(interval);
    })();
  }, []);
  const [chosenQuestions, setQuestions] = useState<any>({});
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const getTime = (dateTime: number) => {
    const time = new Date(dateTime).getTime() - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };
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

  const router = useRouter();
  return (
    <>
      <ModalLay
        opener={open}
        setOpener={setOpen}
        isButton={false}
        onClose={() => {
          router.refresh();
          router.push("/dashboard/practise");
        }}
      >
        <Typography variant="h6" component="h2">
          Results
        </Typography>
        <Box>Score: {data.score}</Box>
        <Box>Correct:{data.count / questions.length}</Box>
        <Box>Accuracy:{((data.count / questions.length) * 100).toFixed(2)}</Box>
        <Box>XP increased:{data.xp}</Box>
        <Box>
          <Typography variant="h6">Questions</Typography>
          {data.questions.length !== 0 &&
            data.questions.map((question: any, index: number) => (
              <Box key={question.id}>
                <Typography fontWeight={600}>
                  {index + 1}. {question.question}
                </Typography>
                <Grid
                  container
                  alignItems={"center"}
                  justifyContent={"center"}
                  width={"32px"}
                  height={"32px"}
                  bgcolor={question.right ? "success.main" : "error.main"}
                  className="rounded-full"
                >
                  {question.right ? (
                    <CheckIcon className="text-white" />
                  ) : (
                    <ClearOutlinedIcon className="text-white" />
                  )}
                </Grid>{" "}
                Correct Answer:{" "}
                {question.type == "FILL"
                  ? question.fill
                  : question.options[0].option}
              </Box>
            ))}
        </Box>
      </ModalLay>
      {questions && questions.length > 0 ? (
        <FormWithLoading
          endpoint={`/api/topics/${topicId}/practise/`}
          submitName="Submit Quiz"
          setDone={setDone}
          data={{ chosen: chosenQuestions, questions: questions }}
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
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Client;
