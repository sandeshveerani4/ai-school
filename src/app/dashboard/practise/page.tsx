import { getTopics, getTopicsBySection } from "@/lib/srv-funcs";
import Client from "./client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Practise = async () => {
  const session = await getServerSession(authOptions);
  const topics = await getTopicsBySection(
    session?.user.student?.sectionId ?? 0
  );
  return <Client topics={topics} session={session} />;
};

export default Practise;
