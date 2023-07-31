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
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import ModalLay from "@/components/ModalLay";
import CheckIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
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
      {data.type === "VIDEO_LESSON" && data.video_url && (
        <Grid
          container
          item
          alignItems={"center"}
          justifyContent={"center"}
          className="py-2"
        >
          <Grid item lg={7} md={12} xs={12}>
            <iframe
              src={data.video_url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: "100%", height: "400px" }}
            ></iframe>
          </Grid>
        </Grid>
      )}
      {data.files.length !== 0 && (
        <Grid item>
          <Typography fontWeight={"medium"}>
            Attachments: {data.files.length} Files
          </Typography>
          {data.files.map(
            (item: any, index: number) =>
              item.file && (
                <Box key={index}>
                  <Link href={config.site.imageDomain + item.file}>
                    {item.name}
                  </Link>
                </Box>
              )
          )}
        </Grid>
      )}
      <Grid className="mt-2" item>
        {data.type === "HOMEWORK" ? (
          <>
            {data.type === "HOMEWORK" && session?.user.role === "STUDENT" && (
              <Box overflow={"hidden"}>
                <IconButton
                  className="my-2 float-right"
                  onClick={() => setShow(!show)}
                >
                  <Add />
                </IconButton>
                <Typography fontWeight={"medium"}>Submissions</Typography>
              </Box>
            )}
            {session?.user.role === "STUDENT" && show && (
              <CreateSubmissions assignmentId={`${data.id}`} />
            )}
            {session && (
              <GetSubmissions
                submissions={data.submissions}
                assignment={data}
                role={session.user.role}
              />
            )}
          </>
        ) : (
          data.type === "QUIZ" &&
          data.submissions.length > 0 && (
            <Grid container direction={"column"} item spacing={2}>
              <Grid item>
                <Box
                  className="mt-2 text-white rounded-lg p-3 inline-block"
                  sx={{
                    background: "linear-gradient(45deg, #f12711, #f5b119)",
                  }}
                >
                  <Typography fontWeight={"bold"}>Results</Typography>
                  <Box>Score: {data.submissions[0].score}</Box>
                  <Box>
                    Correct: {data.submissions[0].correct} /{" "}
                    {data._count.questions}
                  </Box>
                  <Box>
                    Accuracy:{" "}
                    {(
                      ((data.submissions[0].correct as number) /
                        data._count.questions) *
                      100
                    ).toFixed(2)}
                    %
                  </Box>
                  <Box>XP increased: {data.submissions[0].xpInc}</Box>
                </Box>
              </Grid>
              <Grid item>
                <ModalLay
                  buttonProps={{
                    variant: "text",
                    color: "primary",
                    startIcon: <EyeIcon />,
                    size: "medium",
                  }}
                  buttonTitle="View Details"
                >
                  {data.questions.length !== 0 &&
                    data.questions.map((question, index: number) => {
                      const chosen = (data.submissions[0].chosenOptions as any)[
                        question.questionId
                      ];
                      const correct =
                        chosen && question.question.type === "FILL"
                          ? question.question.fill === chosen
                          : question.question.options.find(
                              (opt) => opt.correct === true
                            )?.id === chosen;
                      return (
                        <Box key={question.questionId}>
                          <Typography fontWeight={600}>
                            {index + 1}. {question.question.question}
                          </Typography>
                          <Grid
                            container
                            alignItems={"center"}
                            justifyContent={"center"}
                            width={"32px"}
                            height={"32px"}
                            bgcolor={correct ? "success.main" : "error.main"}
                            className="rounded-full"
                          >
                            {correct ? (
                              <CheckIcon className="text-white" />
                            ) : (
                              <ClearOutlinedIcon className="text-white" />
                            )}
                          </Grid>{" "}
                          Correct Answer:{" "}
                          {question.question.type == "FILL"
                            ? question.question.fill
                            : question.question.options[0].option}
                        </Box>
                      );
                    })}
                </ModalLay>
              </Grid>
            </Grid>
          )
        )}
        {data.type === "QUIZ" &&
          session?.user.role === "STUDENT" &&
          data.submissions.length < 1 && (
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
