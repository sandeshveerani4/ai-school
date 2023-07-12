"use client";
import CreateNotification from "@/components/Notifications/CreateNotification";
import { Box, IconButton } from "@mui/material";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Add from "@mui/icons-material/Add";
import { Class } from "@/components/Classes/ClassRow";
import GetNotifications from "@/components/Notifications/GetNotifications";
export type NotificationMessage = Prisma.NotificationMessageGetPayload<{
  include: {
    _count: { select: { notifications: true } };
    author: true;
    notifications: true;
  };
}>;

const Client = ({
  notifications,
  classes,
}: {
  notifications: NotificationMessage[];
  classes?: Class[];
}) => {
  const { data: session } = useSession();
  const [show, setShow] = useState(false);
  return (
    <Box>
      {classes && (
        <>
          <Box overflow={"hidden"}>
            <IconButton
              onClick={() => setShow(!show)}
              className="float-right my-2"
            >
              <Add />
            </IconButton>
          </Box>
          {show && <CreateNotification classes={classes} />}
        </>
      )}
      <GetNotifications notifications={notifications} />
    </Box>
  );
};

export default Client;
