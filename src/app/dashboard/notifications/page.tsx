import Client from "./client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getClasses, getNotifications } from "@/lib/srv-funcs";

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
