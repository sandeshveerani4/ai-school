import Client from "./client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAssignments, getSubmissions } from "@/lib/srv-funcs";
const Assignments = async () => {
  const session = await getServerSession(authOptions);
  const assignments = await getAssignments(5);
  return <Client assignments={assignments} session={session} />;
};

export default Assignments;
