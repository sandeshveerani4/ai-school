import { getDiscussions } from "@/lib/srv-funcs";
import Client from "./client";
import { getServerSession } from "next-auth";

const Discussions = async () => {
  const session = await getServerSession();
  const discussions = await getDiscussions();
  return <Client discussions={discussions} session={session} />;
};

export default Discussions;
