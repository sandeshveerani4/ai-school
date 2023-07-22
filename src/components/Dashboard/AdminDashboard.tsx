"use client";
import React from "react";
import Stats from "./Stats";
import { Box, Button, CardMedia, Grid, IconButton, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import { Session } from "next-auth";
import { Assignment } from "../Assignments/GetAssignments";
import { Submission } from "@prisma/client";
import { config } from "@/lib/consts";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import Link from "next/link";
interface Stats {
  students: number;
  teachers: number;
  assignments: number;
  questions: number;
}

const Card = ({ children, title }: { children?: React.ReactNode, title: string }) => {
  return <Grid item lg={6} className="bg-white rounded-3xl p-3" xs={12}><Typography variant="caption">{title}</Typography><Box>{children}</Box></Grid>
}

const AdminDashboard = ({
  stats,
  session,
  assignments,
}: {
  stats: Stats;
  session: Session | null;
  assignments: Assignment[];
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item lg={8} md={12} xs={12}>
        <Stats stats={stats} />
        <Grid container >
          <Card title="Assignments">{assignments.map((assignment) => <Grid container item className="p-2" alignItems={'center'} justifyContent={'center'}><Grid item flex={1}>{assignment.title}</Grid><Grid item><IconButton LinkComponent={Link} href={`/dashboard/assignments/${assignment.id}`}><EyeIcon /></IconButton></Grid></Grid>)}<Button variant="contained" color="secondary" LinkComponent={Link} href='/dashboard/assignments' fullWidth>View all assignments</Button></Card>
        </Grid>
      </Grid>
      <Grid item lg={4} md={12} xs={12}>
        <Sidebar session={session} />
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
