import { getTopics } from "@/lib/srv-funcs";
import Client from "./client";

const Practise = async () => {
  const topics = await getTopics(1);
  return <Client topics={topics} />;
};

export default Practise;
