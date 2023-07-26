import { Metadata } from "next";
import DashboardLayout from "@/components/DashboardLayout";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUnreadNotifications } from "@/lib/srv-funcs";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serverSession = await getServerSession(authOptions);
  const unreadCount = await getUnreadNotifications();
  return (
    <DashboardLayout unread={unreadCount} session={serverSession}>
      {children}
    </DashboardLayout>
  );
}
