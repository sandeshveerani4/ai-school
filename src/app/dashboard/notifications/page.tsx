import { config, reqParams } from "@/lib/consts";
import Client from "./client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
const getNotifications = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/notifications/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const getClasses = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/classes/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
const Notifications = async () => {
  const session = await getServerSession(authOptions);
  const notifications = await getNotifications();
  const classes = await getClasses();
  return (
    <Client
      notifications={notifications}
      {...(session?.user.role !== "STUDENT" && { classes: classes })}
    />
  );
};

export default Notifications;
