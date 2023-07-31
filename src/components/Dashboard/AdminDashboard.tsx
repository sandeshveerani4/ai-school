"use client";
import React from "react";
import Stats, { Stats as statType } from "./Stats";
import {
  Box,
  BoxProps,
  Button,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { Session } from "next-auth";
import { Assignment } from "../Assignments/GetAssignments";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import Link from "next/link";
import { NotificationMessage } from "@/app/dashboard/notifications/client";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Prisma } from "@prisma/client";
import Image from "next/image";
import { config } from "@/lib/consts";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";

export type Student = Prisma.StudentGetPayload<{
  include: {
    user: true;
  };
}>;
const Card = ({
  children,
  title,
  bodyProps,
}: {
  children?: React.ReactNode;
  title?: string;
  bodyProps?: BoxProps;
}) => {
  return (
    <Grid item xs={12} lg={6}>
      <Box
        className="bg-white relative h-[100%] rounded-3xl p-3 m-1"
        {...bodyProps}
      >
        {" "}
        {title && <Typography fontWeight={500}>{title}</Typography>}
        {children}
      </Box>
    </Grid>
  );
};
const AssignmentItem = ({ assignment }: { assignment: Assignment }) => {
  const picture = assignment.user.pictureURL;
  const teacher = assignment.user;
  return (
    <Grid
      container
      item
      className="p-2"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Grid item flex={1}>
        {picture && <CardMedia src={picture} className="rounded-full" />}
        <Box>
          <Typography fontWeight={600}>{assignment.title}</Typography>
          <Typography variant="caption" fontSize="small" fontStyle={"italic"}>
            By {teacher.first_name} {teacher.last_name} Deadline:{" "}
            {new Date(assignment.deadline).toLocaleString()}
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <IconButton
          LinkComponent={Link}
          href={`/dashboard/assignments/${assignment.id}`}
        >
          <EyeIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};
const NotificationItem = ({
  notification,
}: {
  notification: NotificationMessage;
}) => {
  const picture = notification.author.pictureURL;
  return (
    <Grid
      container
      item
      className="p-2"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Grid item flex={1}>
        {picture && <CardMedia src={picture} className="rounded-full" />}
        <Box>
          <Typography fontWeight={600}>{notification.title}</Typography>
          <Typography variant="caption" fontSize="small" fontStyle={"italic"}>
            By {notification.author.first_name} {notification.author.last_name}
          </Typography>
        </Box>
      </Grid>
      <Grid item>
        <IconButton
          LinkComponent={Link}
          href={`/dashboard/notifications/${notification.id}`}
        >
          <EyeIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};
const StudentItem = ({ student }: { student: Student }) => {
  return (
    <Grid container spacing={1} py={1} alignItems={"center"}>
      <Grid item>
        <Box
          className="relative flex items-center justify-center text-center"
          width={32}
          height={32}
        >
          {student?.user.pictureURL ? (
            <Image
              src={config.site.imageDomain + student.user.pictureURL}
              className="rounded-full bg-neutral-100"
              fill
              alt="Profile Picture"
            />
          ) : (
            <Person2OutlinedIcon sx={{ fontSize: 25, color: "white" }} />
          )}
        </Box>
      </Grid>
      <Grid item flex={1}>
        <Typography fontWeight={"bold"}>
          {student.user.first_name} {student.user.last_name}
        </Typography>
      </Grid>
      <Grid item>
        <Typography fontWeight={"bold"}>{student.xp} XP</Typography>
      </Grid>
    </Grid>
  );
};
const AdminDashboard = ({
  stats,
  session,
  assignments,
  notifications,
  performance,
}: {
  stats: statType;
  session: Session | null;
  assignments: Assignment[];
  notifications: NotificationMessage[];
  performance: Student[];
}) => {
  return (
    <Grid container spacing={1}>
      <Grid item lg={8} md={12} xs={12}>
        <Stats stats={stats} />
        <Grid container rowGap={2}>
          <Card title="Assignments">
            {assignments.length === 0
              ? "No Assignments Found"
              : assignments.map((assignment) => (
                  <AssignmentItem {...{ assignment }} key={assignment.id} />
                ))}
            <Button
              color="secondary"
              LinkComponent={Link}
              href="/dashboard/assignments"
              fullWidth
            >
              View all Assignments
            </Button>
          </Card>
          <Card
            title="Top Performance Students"
            bodyProps={{
              style: {
                background: "linear-gradient(45deg,#0540e6,#00f2dc)",
                color: "white",
              },
            }}
          >
            {performance.map((student) => (
              <StudentItem key={student.userId} {...{ student }} />
            ))}
          </Card>
          <Card
            title="Overall Submissions"
            bodyProps={{
              style: {
                background: "linear-gradient(45deg,#56068d,#f347d6)",
                color: "white",
              },
            }}
          >
            <Grid minHeight={"100px"} container>
              <Grid
                container
                alignItems={"center"}
                justifyItems={"center"}
                item
                xs={3}
              >
                <AssignmentOutlinedIcon style={{ fontSize: "100px" }} />
              </Grid>
              <Grid
                container
                item
                xs={9}
                alignItems={"center"}
                justifyItems={"center"}
              >
                <Typography variant="h3" fontWeight={700}>
                  {stats.submissions}
                </Typography>
              </Grid>
            </Grid>
          </Card>
          <Card title="Notifications">
            {notifications.length === 0
              ? "No Notifications Found"
              : notifications.map((notification) => (
                  <NotificationItem
                    {...{ notification }}
                    key={notification.id}
                  />
                ))}
            <Button
              color="secondary"
              LinkComponent={Link}
              href="/dashboard/notifications"
              fullWidth
            >
              View all Notifications
            </Button>
          </Card>
        </Grid>
      </Grid>
      <Grid item lg={4} md={12} xs={12}>
        <Sidebar session={session} />
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
