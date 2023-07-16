import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import { authOptions } from "@/lib/auth";
import { getStats } from "@/lib/srv-funcs";
import { getServerSession } from "next-auth";
import React from "react";

const Dashboard = async () => {
  const stats = await getStats();
  const session = await getServerSession(authOptions);
  return <AdminDashboard stats={stats} session={session} />;
};
export default Dashboard;
