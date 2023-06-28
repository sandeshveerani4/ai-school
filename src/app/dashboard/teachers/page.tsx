"use client";
import CreateTeacher from "@/components/Teachers/CreateTeacher";
import { Box, Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React from "react";
import GetTeachers from "@/components/Teachers/GetTeachers";

const Teachers = () => {
  const [show, setShow] = React.useState(false);
  return (
    <Box>
      <Box overflow={"hidden"}>
        <Button
          variant="contained"
          onClick={() => setShow(!show)}
          color="secondary"
          className="float-right my-2"
        >
          <Add /> Add Teacher
        </Button>
      </Box>
      {show && <CreateTeacher />}
      <GetTeachers />
    </Box>
  );
};

export default Teachers;
