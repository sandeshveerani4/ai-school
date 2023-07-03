"use client";
import { Box, Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import GetStudents from "@/components/Students/GetStudents";
import CreateAssignment from "@/components/Assignments/CreateAssignment";
import GetAssignments from "@/components/Assignments/GetAssignments";
const Assignments = () => {
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
        <Button
          variant="contained"
          onClick={() => setShow(!show)}
          color="secondary"
          className="float-right my-2"
        >
          <Add /> Add Assignment
        </Button>
      </Box>
      {show && <CreateAssignment reloadData={reloadData} />}
      <GetAssignments reload={reload} />
    </Box>
  );
};

export default Assignments;
