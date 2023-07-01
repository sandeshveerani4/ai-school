"use client";
import { Box, Typography } from "@mui/material";
import React from "react";

const Topics = ({ params }: { params: { id: string } }) => {
  return (
    <Box>
      <Typography variant="h5">Topics</Typography>
    </Box>
  );
};

export default Topics;
