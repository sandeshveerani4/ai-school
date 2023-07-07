import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import { config, reqParams } from "@/lib/consts";
import React from "react";

const getStats = async () => {
  const options: RequestInit = await reqParams(true);
  const res = await fetch(`${config.site.url}/api/dashboard/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};

const Dashboard = async () => {
  const stats = await getStats();
  return <AdminDashboard stats={stats} />;
};
export default Dashboard;
