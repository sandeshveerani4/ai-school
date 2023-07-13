"use client";
import React from "react";
import Stats from "./Stats";
import { Box, Grid } from "@mui/material";
import Sidebar from "./Sidebar";
interface Stats {
  students: number;
  teachers: number;
  assignments: number;
  questions: number;
}
const AdminDashboard = ({ stats }: { stats: Stats }) => {
  return (
    <Grid container spacing={1}>
      <Grid item lg={8} md={9}>
        <Stats stats={stats} />
      </Grid>
      <Grid item lg={4} md={3}>
        <Sidebar />
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
