"use client";
import { Box, CardMedia, Divider, Grid, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import React, { useState } from "react";
import { config } from "@/lib/consts";
import { Session } from "next-auth";
import Image from "next/image";
import dayjs, { Dayjs } from "dayjs";

const Calendar = ({ session }: { session: Session | null }) => {
  const today = new Date().toISOString();
  const [value, setValue] = useState(dayjs(today));
  return (
    <Grid container direction={"column"} className="p-4 bg-white rounded-2xl">
      <Grid container className="p-2" spacing={2}>
        <Grid item>
          <Box
            className="relative flex items-center justify-center text-center"
            width={80}
            height={80}
          >
            {session?.user.pictureURL ? (
              <Image
                src={config.site.imageDomain + session.user.pictureURL}
                className="rounded-full bg-neutral-100"
                fill
                alt="Profile Picture"
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
      <Grid item>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            defaultValue={dayjs(today)}
            onChange={(newValue) => setValue(newValue as Dayjs)}
          />
        </LocalizationProvider>
      </Grid>
      {/* <Divider className="my-2" />
      <Grid item>
        <Typography variant="button">Timeline</Typography>
      </Grid> */}
    </Grid>
  );
};

export default Calendar;
