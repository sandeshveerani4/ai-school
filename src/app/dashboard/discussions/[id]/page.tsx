import React from "react";
import Client from "./client";
import { getMessages } from "@/lib/srv-funcs";

const Chat = async ({ params }: { params: { id: string } }) => {
  const discussionId = Number(params.id);
  const messages = await getMessages(discussionId);
  return <Client discussionId={discussionId} messages={messages} />;
};

export default Chat;
