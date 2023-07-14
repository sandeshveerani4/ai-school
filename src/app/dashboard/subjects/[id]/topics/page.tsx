import React from "react";
import Client from "./client";
import { getTopics } from "@/lib/srv-funcs";

const Topics = async ({ params }: { params: { id: string } }) => {
  const subjectId = Number(params.id);
  const topics = await getTopics(subjectId);
  return <Client topics={topics} subjectId={subjectId} />;
};

export default Topics;
