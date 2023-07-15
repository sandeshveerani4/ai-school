"use client";
import React, { useState } from "react";
import { Prisma } from "@prisma/client";
import { Box, IconButton } from "@mui/material";
import GetDiscussions from "@/components/Discussions/GetDiscussions";
import { useSession } from "next-auth/react";
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
  return (
    <Box>
      {session && session.user.role === "STUDENT" && <CreateDiscussion />}
      <GetDiscussions discussions={discussions} session={session} />
    </Box>
  );
};

export default Client;
