"use client";
import { Box, Button, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import GetTopics from "@/components/Topics/GetTopics";
import CreateTopics from "@/components/Topics/CreateTopics";

const Topics = ({ params }: { params: { id: string } }) => {
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
      {show && <CreateTopics reloadData={reloadData} subjectId={params.id} />}
      <GetTopics reload={reload} subjectId={params.id} />
    </Box>
  );
};

export default Topics;
