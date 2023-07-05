"use client";
import CreateStudent from "@/components/Students/CreateStudent";
import { Box, Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import GetStudents from "@/components/Students/GetStudents";
import BulkImport from "@/components/Students/BulkImport";
import GetQuestions from "@/components/Questions/GetQuestions";
import CreateQuestions from "@/components/Questions/CreateQuestions";
const Questions = () => {
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
          endpoint="/api/questions/bulkimport"
          subText="Headings should be named: Question, option_A, option_B, option_C,
          option_D, correct,score"
        />
        <Button
          variant="contained"
          onClick={() => setShow(!show)}
          color="secondary"
          className="float-right my-2"
        >
          <Add /> Add Question
        </Button>
      </Box>
      {show && <CreateQuestions reloadData={reloadData} />}
      <GetQuestions reload={reload} />
    </Box>
  );
};

export default Questions;
