"use client";
import { Topic } from "@/components/Topics/GetTopics";
import { Box, Grid } from "@mui/material";
import React from "react";

const Client = ({ topics }: { topics: Topic[] }) => {
  return (
    <Grid container spacing={1}>
      {topics.map((topic) => (
        <Grid
          className="bg-white p-2 rounded-3xl text-center"
          item
          lg={3}
          xs={12}
        >
          {topic.title}
        </Grid>
      ))}
    </Grid>
  );
};

export default Client;
