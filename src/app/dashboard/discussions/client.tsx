"use client";
import React, { useState } from "react";
import { Prisma } from "@prisma/client";
import { Box, IconButton } from "@mui/material";
import GetDiscussions from "@/components/Discussions/GetDiscussions";
import { useSession } from "next-auth/react";
import Add from "@mui/icons-material/Add";
import CreateDiscussion from "@/components/Discussions/CreateDiscussion";
export type Discussion = Prisma.DiscussionGetPayload<{
  include: {
    topic: true;
  };
}>;
const Client = ({ discussions }: { discussions: Discussion[] }) => {
  const { data: session } = useSession();
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
      <GetDiscussions discussions={discussions} />
    </Box>
  );
};

export default Client;
