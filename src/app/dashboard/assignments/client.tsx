"use client";
import { Box, Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import CreateAssignment from "@/components/Assignments/CreateAssignment";
import GetAssignments, {
  Assignment,
} from "@/components/Assignments/GetAssignments";
import { Session } from "next-auth";

const Client = ({
  assignments,
  session,
}: {
  assignments: Assignment[];
  session: Session | null;
}) => {
  return (
    <Box>
      {session && session.user.role !== "STUDENT" && <CreateAssignment />}
      <GetAssignments assignments={assignments} />
    </Box>
  );
};

export default Client;
