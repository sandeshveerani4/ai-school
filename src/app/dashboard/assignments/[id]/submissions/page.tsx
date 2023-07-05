"use client";
import { Box, Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect } from "react";
import CreateAssignment from "@/components/Assignments/CreateAssignment";
import GetAssignments from "@/components/Assignments/GetAssignments";
import { useSession } from "next-auth/react";
import GetSubmissions from "@/components/Assignments/GetSubmissions";
import CreateSubmissions from "@/components/Assignments/CreateSubmissions";
const Submissions = ({ params }: { params: { id: string } }) => {
  const { data: session } = useSession();
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
      {session?.user.role === "STUDENT" && (
        <>
          <Box overflow={"hidden"}>
            <Button
              variant="outlined"
              onClick={() => setShow(!show)}
              color="secondary"
              className="float-right my-2"
            >
              <Add /> Add Submission
            </Button>
          </Box>
          {show && (
            <CreateSubmissions
              assignmentId={params.id}
              reloadData={reloadData}
            />
          )}
        </>
      )}
      <GetSubmissions reload={reload} assignmentId={params.id} />
    </Box>
  );
};

export default Submissions;
