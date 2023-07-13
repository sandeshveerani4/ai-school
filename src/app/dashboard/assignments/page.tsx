import { config, reqParams } from "@/lib/consts";
import Client from "./client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
const getAssignments = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/assignments/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const Assignments = async () => {
  const session = await getServerSession(authOptions);
  const assignments = await getAssignments();
  return <Client assignments={assignments} session={session} />;
};

export default Assignments;
