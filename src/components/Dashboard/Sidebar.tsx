"use client";
import { Box, CardMedia, Divider, Grid, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

const Calendar = () => {
  const { data: session } = useSession();
  return (
    <Box className="p-4 bg-white rounded-2xl">
      <Grid container className="p-2" spacing={2}>
        <Grid item>
          <Box
            className="bg-neutral-100 flex items-center justify-center text-center rounded-full p-2"
            width={80}
            height={80}
          >
            {session?.user.pictureURL ? (
              <CardMedia
                src={session.user.pictureURL}
                className="rounded-lg"
                sx={{ width: "100%" }}
              />
            ) : (
              <Person2OutlinedIcon sx={{ fontSize: 50 }} color="primary" />
            )}
          </Box>
        </Grid>
        <Grid container item alignItems={"center"} flex={1}>
          <Grid item>
            <Typography fontSize={"medium"} fontWeight={600}>
              {session?.user.first_name} {session?.user.last_name}
            </Typography>
            <Typography fontSize={"small"} color={"seccondary"}>
              {session?.user.role === "ADMIN"
                ? "Admin User"
                : session?.user.role === "TEACHER"
                ? "Teacher"
                : "Class: " + session?.user.student?.class.name}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Divider className="my-2" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar />
      </LocalizationProvider>
      <Box>
        <Typography variant="button">Timeline</Typography>
      </Box>
    </Box>
  );
};

export default Calendar;
