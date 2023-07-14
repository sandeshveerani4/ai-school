import React, { useState } from "react";
import SearchTopics from "../Topics/SearchTopics";
import { Topic } from "../Topics/GetTopics";
import { Box } from "@mui/material";
import FormWithLoading from "../FormWithLoading";

const CreateDiscussion = () => {
  const [selectedTopic, changeTopic] = useState<Topic>({} as Topic);
  return (
    <Box>
      <SearchTopics changeTopic={changeTopic} />
      <FormWithLoading
        data={{ topicId: selectedTopic.id }}
        endpoint="/api/discussions"
        submitName="Open Discussion"
      ></FormWithLoading>
    </Box>
  );
};

export default CreateDiscussion;
