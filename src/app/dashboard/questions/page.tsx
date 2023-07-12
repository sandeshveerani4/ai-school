"use client";
import CreateStudent from "@/components/Students/CreateStudent";
import { Box, Button, IconButton } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import GetStudents from "@/components/Students/GetStudents";
import BulkImport from "@/components/Students/BulkImport";
import GetQuestions from "@/components/Questions/GetQuestions";
import CreateQuestions from "@/components/Questions/CreateQuestions";
import SearchTopics from "@/components/Topics/SearchTopics";
import { Topic } from "@/components/Topics/GetTopics";
const Questions = () => {
  const [show, setShow] = React.useState(false);

  const [reload, reloadData] = React.useState(false);
  const [topic, changeTopic] = React.useState<Topic>({} as Topic);
  const middleware = async () => {
    if (topic) return { topicId: topic.id };
    throw new Error("Please provide topic");
  };
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
          middleware={middleware}
          subText="Headings should be named: question, option_A, option_B, option_C,
          option_D, correct,score"
        >
          <SearchTopics changeTopic={changeTopic} />{" "}
          {topic.id && `Selected topic: ${topic.id}`}
        </BulkImport>
        <IconButton onClick={() => setShow(!show)} className="float-right my-2">
          <Add />
        </IconButton>
      </Box>
      {show && <CreateQuestions reloadData={reloadData} />}
      <GetQuestions reload={reload} />
    </Box>
  );
};

export default Questions;
