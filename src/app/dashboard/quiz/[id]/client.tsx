"use client";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Prisma } from "@prisma/client";
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
  handleChange,
}: {
  question: QuestionType;
  index: number;
  handleChange: any;
}) => {
  return (
    <Grid item xs={12} className="p-3 bg-white rounded-2xl">
      <Typography fontSize="medium" fontWeight={"medium"}>
        {index + 1}. {question.question}
      </Typography>
      <RadioGroup
        onChange={(e) =>
          handleChange({ id: question.id, val: Number(e.target.value) })
        }
      >
        {question.type === "MCQ" &&
          (question.options.length === 0
            ? "No Options Found"
            : question.options.map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item.id}
                  control={<Radio />}
                  label={item.option}
                />
              )))}
      </RadioGroup>
      {question.type === "FILL" && (
        <TextField
          size="small"
          className="my-1"
          label="Fill in the blank"
          onChange={(e) =>
            handleChange({ id: question.id, val: e.target.value })
          }
          fullWidth
        />
      )}
    </Grid>
  );
};
const Client = ({ quiz }: { quiz: Quiz }) => {
  const [chosenQuestions, setQuestions] = useState({});
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
  return (
    <Grid container gap={2} direction={"row"} className="pb-4">
      <Grid item xs={12}>
        <Typography fontWeight={500} variant="h5">
          {quiz.title}
        </Typography>
        <Typography>
          Ends at: {new Date(quiz.deadline).toLocaleString()}
        </Typography>
        <Typography fontWeight={"medium"}>
          Remaining Time: {days && `${days}d `} {hours && `${hours}h`}{" "}
          {`${minutes}m`} {`${seconds}s`}
        </Typography>
      </Grid>
      {quiz.questions.map((item, index) => (
        <Question
          question={item.question}
          key={index}
          index={index}
          handleChange={handleChange}
        />
      ))}
      <Button variant="contained" color="secondary">
        Submit Quiz
      </Button>
    </Grid>
  );
};

export default Client;
