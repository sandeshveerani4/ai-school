import { config, reqParams } from "@/lib/consts";
import Client from "./client";
const getUser = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/user/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const Profile = async () => {
  const user = await getUser();
  return <Client userDetails={user} />;
};

export default Profile;
