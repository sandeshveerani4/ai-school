import React, { useState } from "react";
import SearchTopics from "../Topics/SearchTopics";
import { Topic } from "../Topics/GetTopics";
import { Box, IconButton } from "@mui/material";
import FormWithLoading from "../FormWithLoading";
import Add from "@mui/icons-material/Add";

const CreateDiscussion = () => {
  const [selectedTopic, changeTopic] = useState<Topic>({} as Topic);
  const [show, setShow] = useState(false);

  return (
    <>
      <Box overflow={"hidden"}>
        <IconButton onClick={() => setShow(!show)} className="float-right my-2">
          <Add />
        </IconButton>
      </Box>
      {show && (
        <Box>
          <SearchTopics changeTopic={changeTopic} />
          <FormWithLoading
            data={{ topicId: selectedTopic.id }}
            endpoint="/api/discussions"
            submitName="Open Discussion"
          ></FormWithLoading>
        </Box>
      )}
    </>
  );
};

export default CreateDiscussion;
