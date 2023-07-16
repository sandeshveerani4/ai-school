"use client";
import React from "react";
import Stats from "./Stats";
import { Box, Grid } from "@mui/material";
import Sidebar from "./Sidebar";
import { Session } from "next-auth";
interface Stats {
  students: number;
  teachers: number;
  assignments: number;
  questions: number;
}
const AdminDashboard = ({
  stats,
  session,
}: {
  stats: Stats;
  session: Session | null;
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item lg={8} md={12} xs={12}>
        <Stats stats={stats} />
      </Grid>
      <Grid item lg={4} md={12} xs={12}>
        <Sidebar session={session} />
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
