import { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import { config, reqParams } from "@/lib/consts";

export const metadata: Metadata = {
  title: "Dashboard",
};
const getUnreadNotifications = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/notifications/fetch`, {
    ...options,
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadCount = await getUnreadNotifications();
  return (
    <DashboardLayout unread={unreadCount.unread}>{children}</DashboardLayout>
  );
}
