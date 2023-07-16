"use client";
import { Box } from "@mui/material";
import React from "react";
import GetQuestions, { Question } from "@/components/Questions/GetQuestions";
import CreateQuestions from "@/components/Questions/CreateQuestions";
import { Class } from "@/components/Classes/ClassRow";
const Client = ({
  questions,
  classes,
}: {
  questions: Question[];
  classes: Class[];
}) => {
  return (
    <Box>
      <CreateQuestions />
      <GetQuestions classes={classes} />
    </Box>
  );
};

export default Client;
