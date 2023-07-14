"use client";
import StudentFields, { Student } from "@/components/Students/StudentFields";
import React from "react";
import { Typography } from "@mui/material";
import { Class } from "@/components/Classes/ClassRow";

const Client = ({
  student,
  classes,
}: {
  student: Student;
  classes: Class[];
}) => {
  return (
    <>
      <Typography variant="h4" className="mb-3">
        {student?.first_name + " " + student?.last_name}
      </Typography>
      <StudentFields student={student} classes={classes} />
    </>
  );
};

export default Client;
