"use client";
import { Box, Button, IconButton } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useState } from "react";
import CreateAssignment from "@/components/Assignments/CreateAssignment";
import GetAssignments, {
  Assignment,
} from "@/components/Assignments/GetAssignments";
import { useSession } from "next-auth/react";

const Client = ({ assignments }: { assignments: Assignment[] }) => {
  const { data: session } = useSession();
  const [show, setShow] = useState(false);
  return (
    <Box>
      {session && session.user.role !== "STUDENT" && (
        <>
          <Box overflow={"hidden"}>
            <IconButton
              onClick={() => setShow(!show)}
              className="float-right my-2"
            >
              <Add />
            </IconButton>
          </Box>
          {show && <CreateAssignment />}
        </>
      )}
      <GetAssignments assignments={assignments} />
    </Box>
  );
};

export default Client;
