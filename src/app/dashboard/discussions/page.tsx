import { getDiscussions } from "@/lib/srv-funcs";
import Client from "./client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Discussions = async () => {
  const session = await getServerSession(authOptions);
  const discussions = await getDiscussions();
  return <Client discussions={discussions} session={session} />;
};

export default Discussions;
