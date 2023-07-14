"use client";
import React, { useState } from "react";
import { Prisma } from "@prisma/client";
import { Box, IconButton } from "@mui/material";
import GetDiscussions from "@/components/Discussions/GetDiscussions";
import { useSession } from "next-auth/react";
import Add from "@mui/icons-material/Add";
import CreateDiscussion from "@/components/Discussions/CreateDiscussion";
import { Session } from "next-auth";
export type Discussion = Prisma.DiscussionGetPayload<{
  include: {
    topic: {
      include: {
        subject: {
          include: {
            section: { include: { classTeacher: { include: { user: true } } } };
          };
        };
      };
    };
    student: {
      include: {
        user: true;
      };
    };
  };
}>;
const Client = ({
  discussions,
  session,
}: {
  discussions: Discussion[];
  session: Session | null;
}) => {
  const [show, setShow] = useState(false);

  return (
    <Box>
      {session && session.user.role === "STUDENT" && (
        <>
          <Box overflow={"hidden"}>
            <IconButton
              onClick={() => setShow(!show)}
              className="float-right my-2"
            >
              <Add />
            </IconButton>
          </Box>
          {show && <CreateDiscussion />}
        </>
      )}
      <GetDiscussions discussions={discussions} session={session} />
    </Box>
  );
};

export default Client;
