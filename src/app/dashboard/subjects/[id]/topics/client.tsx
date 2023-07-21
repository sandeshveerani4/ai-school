"use client";
import { Box, Button, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import GetTopics, { Topic } from "@/components/Topics/GetTopics";
import CreateTopics from "@/components/Topics/CreateTopics";

const Client = ({
  topics,
  subjectId,
}: {
  topics: Topic[];
  subjectId: number;
}) => {
  const [show, setShow] = React.useState(false);
  return (
    <Box>
      <Typography component={"div"} variant="h5">
        Topics
      </Typography>
      <Box overflow={"hidden"}>
        <Button
          variant="contained"
          onClick={() => setShow(!show)}
          color="secondary"
          className="float-right my-2"
        >
          <Add /> Add Topic  
        </Button>
      </Box>
      {show && <CreateTopics subjectId={subjectId} />}
      <GetTopics topics={topics} />
    </Box>
  );
};

export default Client;
