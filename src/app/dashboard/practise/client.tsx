"use client";
import { Topic } from "@/components/Topics/GetTopics";
import { Box, Grid, Button } from "@mui/material";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

const Client = ({
  topics,
  session,
}: {
  topics: Topic[];
  session: Session | null;
}) => {
  return (
    <Grid container direction={"column"} gap={1}>
      {topics.map((topic) => (
        <Grid item lg={3} xs={12}>
          <Button
            LinkComponent={Link}
            href={`/dashboard/practise/${topic.id}`}
            className="bg-white px-4 rounded-3xl text-center"
          >
            {topic.title}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default Client;
