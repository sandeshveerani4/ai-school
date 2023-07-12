"use client";
import React, { useState } from "react";
import { Box, Grid, Typography, Chip, IconButton, Button } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { config } from "@/lib/consts";
import GetSubmissions from "@/components/Assignments/GetSubmissions";
import { Assignment } from "@/components/Assignments/GetAssignments";
import CreateSubmissions from "@/components/Assignments/CreateSubmissions";
const Client = ({ data }: { data: Assignment }) => {
  const { data: session } = useSession();
  const [show, setShow] = useState(false);
  return (
    <Grid container direction={"column"}>
      <Grid item>
        <Typography variant="h5" fontWeight={"bold"}>
          {data.title}
        </Typography>
        <Box>
          <Chip
            label={data.type}
            variant="outlined"
            size="small"
            color={data.type === "QUIZ" ? "warning" : "info"}
          />
          {session && session?.user.role !== "STUDENT" && (
            <>
              {" "}
              <Chip
                label={data.visible ? "Visible" : "Not visible"}
                variant="outlined"
                size="small"
                color={data.visible ? "success" : "default"}
              />
            </>
          )}{" "}
          {!data.enabled && (
            <Chip
              label={"Disabled"}
              variant="outlined"
              size="small"
              color={"default"}
            />
          )}
          <Chip
            size="small"
            variant="outlined"
            label={`Deadline: ${new Date(data.deadline).toLocaleString()}`}
          />{" "}
          {data.willStartAt && (
            <Chip
              size="small"
              variant="outlined"
              label={`Starting: ${new Date(data.willStartAt).toLocaleString()}`}
            />
          )}
        </Box>
      </Grid>
      <Grid className="py-2" item>
        <Typography fontWeight={"medium"}>Description</Typography>
        <Typography>{data.description}</Typography>
      </Grid>
      <Grid item>
        <Typography fontWeight={"medium"}>
          Attachments: {data.files.length} Files
        </Typography>
        {data.files.map(
          (item: any) =>
            item.file && (
              <Box>
                <Link href={config.site.imageDomain + item.file}>
                  {item.name}
                </Link>
              </Box>
            )
        )}
      </Grid>
      <Grid className="mt-2" item>
        {data.type === "HOMEWORK" ? (
          <>
            <Box overflow={"hidden"}>
              <IconButton
                className="my-2 float-right"
                onClick={() => setShow(!show)}
              >
                <Add />
              </IconButton>
              <Typography fontWeight={"medium"}>Submissions</Typography>
            </Box>
            {show && <CreateSubmissions assignmentId={`${data.id}`} />}
            <GetSubmissions submissions={data.submissions} />
          </>
        ) : data.submissions.length > 0 ? (
          <Box className="border border-solid rounded-2xl p-2 w-auto">
            <Typography fontWeight={"medium"}>Results</Typography>
            <Box>Score: {data.submissions[0].score}</Box>
            <Box>Correct: {data.submissions[0].correct}</Box>
            <Box>
              Accuracy:{" "}
              {((data.submissions[0].correct as number) /
                data._count.questions) *
                100}
              %
            </Box>
          </Box>
        ) : (
          <Button
            variant="contained"
            LinkComponent={Link}
            href={`/dashboard/quiz/${data.id}`}
            color="secondary"
          >
            Attempt Quiz Now
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default Client;
