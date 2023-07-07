import { config, reqParams } from "@/lib/consts";
import React from "react";
import Client from "./client";

const getAssignment = async (id: string) => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/assignments/${id}`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const AssignmentDetails = async ({ params }: { params: { id: string } }) => {
  const data = await getAssignment(params.id);
  return <Client data={data} />;
};

export default AssignmentDetails;
