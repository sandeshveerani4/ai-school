"use client";
import { Topic } from "@/components/Topics/GetTopics";
import { Box, Grid } from "@mui/material";
import React from "react";

const Client = ({ topics }: { topics: Topic[] }) => {
  return (
    <Grid container>
      {topics.map((topic) => (
        <Grid item lg={3}>
          {topic.title}
        </Grid>
      ))}
    </Grid>
  );
};

export default Client;
