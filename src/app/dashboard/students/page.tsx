"use client";
import CreateStudent from "@/components/Students/CreateStudent";
import { Box, Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React from "react";
import GetStudents from "@/components/Students/GetStudents";
import { Student } from "@/components/Students/StudentFields";

const Students = () => {
  const [show, setShow] = React.useState(false);
  const [data, setData] = React.useState<Student[]>([]);
  return (
    <Box>
      <Box overflow={"hidden"}>
        <Button
          variant="contained"
          onClick={() => setShow(!show)}
          color="primary"
          className="float-right my-2 ml-2"
        >
          <Add /> Bulk Import Students
        </Button>
        <Button
          variant="contained"
          onClick={() => setShow(!show)}
          color="secondary"
          className="float-right my-2"
        >
          <Add /> Add Student
        </Button>
      </Box>
      {show && <CreateStudent data={data} setData={setData} />}
      <GetStudents data={data} setData={setData}/>
    </Box>
  );
};

export default Students;
