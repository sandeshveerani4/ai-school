"use client";
import CreateTeacher from "@/components/Teachers/CreateTeacher";
import { Box, Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import GetTeachers from "@/components/Teachers/GetTeachers";
import { Teacher } from "@/components/Teachers/TeacherFields";

const Client = ({ teachers }: { teachers: Teacher[] }) => {
  return (
    <Box>
      <CreateTeacher />
      <GetTeachers teachers={teachers} />
    </Box>
  );
};

export default Client;
