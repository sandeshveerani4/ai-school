import { config, reqParams } from "@/consts";
import Client from "./client";
export const getAssignments = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/assignments/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const Assignments = async () => {
  const assignments = await getAssignments();
  return <Client assignments={assignments} />;
};

export default Assignments;
