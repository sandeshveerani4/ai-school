"use client";
import CreateStudent from "@/components/Students/CreateStudent";
import { Box, Button, IconButton } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import GetStudents from "@/components/Students/GetStudents";
import BulkImport from "@/components/Students/BulkImport";
import { Student } from "@/components/Students/StudentFields";
import { Class } from "@/components/Classes/ClassRow";
const Client = ({
  students,
  classes,
}: {
  students: Student[];
  classes: Class[];
}) => {
  const [show, setShow] = React.useState(false);
  return (
    <Box>
      <Box overflow={"hidden"}>
        <BulkImport
          endpoint="/api/students/bulkimport"
          subText="Headings should be named: First Name, Last Name, Class, Section,
          Username, Password"
        />
        <IconButton onClick={() => setShow(!show)} className="float-right my-2">
          <Add />
        </IconButton>
      </Box>
      {show && <CreateStudent classes={classes} />}
      <GetStudents students={students} />
    </Box>
  );
};

export default Client;
