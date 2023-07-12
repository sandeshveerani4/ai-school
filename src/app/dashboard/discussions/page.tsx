import { config, reqParams } from "@/lib/consts";
import Client from "./client";
const getDiscussions = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/discussions/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const Discussions = async () => {
  const discussions = await getDiscussions();
  return <Client discussions={discussions} />;
};

export default Discussions;
