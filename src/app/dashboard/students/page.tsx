"use client";
import CreateStudent from "@/components/Students/CreateStudent";
import { Box, Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import GetStudents from "@/components/Students/GetStudents";
import BulkImport from "@/components/Students/BulkImport";
const Students = () => {
  const [show, setShow] = React.useState(false);

  const [reload, reloadData] = React.useState(false);

  useEffect(() => {
    if (reload) {
      setShow(!show);
      reloadData(false);
    }
  }, [reload]);

  return (
    <Box>
      <Box overflow={"hidden"}>
        <BulkImport
          reloadData={reloadData}
          endpoint="/api/students/bulkimport"
          subText="Headings should be named: First Name, Last Name, Class, Section,
          Username, Password"
        />
        <Button
          variant="contained"
          onClick={() => setShow(!show)}
          color="secondary"
          className="float-right my-2"
        >
          <Add /> Add Student
        </Button>
      </Box>
      {show && <CreateStudent reloadData={reloadData} />}
      <GetStudents reload={reload} />
    </Box>
  );
};

export default Students;
