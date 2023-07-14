"use client";
import { Box } from "@mui/material";
import GetClasses from "@/components/Classes/GetClasses";
import React from "react";
import CreateClass from "@/components/Classes/CreateClass";
import { Class } from "@/components/Classes/ClassRow";
import { Teacher } from "@/components/Teachers/TeacherFields";

const Client = ({
  classes,
  teachers,
}: {
  classes: Class[];
  teachers: Teacher[];
}) => {
  return (
    <Box>
      <CreateClass />
      <GetClasses classes={classes} teachers={teachers} />
    </Box>
  );
};

export default Client;
