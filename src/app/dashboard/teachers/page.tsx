"use client";
import CreateTeacher from "@/components/Teachers/CreateTeacher";
import { Box, Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import GetTeachers from "@/components/Teachers/GetTeachers";

const Teachers = () => {
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
          <Add /> Add Teacher
        </Button>
      </Box>
      {show && <CreateTeacher reloadData={reloadData} />}
      <GetTeachers reload={reload} />
    </Box>
  );
};

export default Teachers;
