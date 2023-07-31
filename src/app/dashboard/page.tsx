import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import { authOptions } from "@/lib/auth";
import {
  getAssignments,
  getNotifications,
  getPerformance,
  getStats,
} from "@/lib/srv-funcs";
import { getServerSession } from "next-auth";
import React from "react";

const Dashboard = async () => {
  const stats = await getStats();
  const session = await getServerSession(authOptions);
  const assignments = await getAssignments(5);
  const notifications = await getNotifications(5);
  const performance = await getPerformance(10);
  return (
    <AdminDashboard
      stats={stats}
      {...{ session, assignments, notifications, performance }}
    />
  );
};
export default Dashboard;
