import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import { authOptions } from "@/lib/auth";
import { getAssignments, getStats } from "@/lib/srv-funcs";
import { getServerSession } from "next-auth";
import React from "react";

const Dashboard = async () => {
  const stats = await getStats();
  const session = await getServerSession(authOptions);
  const assignments = await getAssignments();
  return <AdminDashboard stats={stats} session={session} assignments={assignments} />;
};
export default Dashboard;
