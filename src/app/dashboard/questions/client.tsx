"use client";
import { Box } from "@mui/material";
import React from "react";
import GetQuestions, { Question } from "@/components/Questions/GetQuestions";
import CreateQuestions from "@/components/Questions/CreateQuestions";
const Client = ({ questions }: { questions: Question[] }) => {
  return (
    <Box>
      <CreateQuestions />
      <GetQuestions questions={questions} />
    </Box>
  );
};

export default Client;
