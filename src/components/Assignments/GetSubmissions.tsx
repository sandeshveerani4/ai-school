"use client";
import {
  Box,
  Button,
  CardMedia,
  Grid,
  IconButton,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { config, reqParams } from "@/lib/consts";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Submission } from "@prisma/client";
import ModalLay from "../ModalLay";
import Link from "next/link";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import { Assignment } from "./GetAssignments";
import CheckIcon from "@mui/icons-material/CheckOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { inputWhite } from "../Students/StudentFields";
const GetSubmissions = ({
  submissions,
  assignment,
  role,
}: {
  submissions: Submission[];
  assignment: Assignment;
  role: string;
}) => {
  const getColumns = () => {
    const A = [{ field: "id", headerName: "ID" }];
    const B = [
      {
        field: "createdAt",
        headerName: "Submitted On:",
        width: 150,
        flex: 1,
        renderCell: (params: any) => new Date(params.value).toLocaleString(),
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params: GridRenderCellParams<Submission>) => {
          const [opener, setOpener] = useState(false);
          const chosenOptions = params.row.chosenOptions as any;
          return (
            <>
              <IconButton onClick={() => setOpener(true)}>
                <EyeIcon />
              </IconButton>
              <ModalLay
                buttonTitle="View"
                isButton={false}
                opener={opener}
                setOpener={setOpener}
                buttonProps={{ color: "primary" }}
              >
                <Box>
                  <Typography variant="button" component={"div"}>
                    Submitted On:
                  </Typography>
                  <Typography fontSize={"small"}>
                    {new Date(params.row.createdAt).toLocaleString()}
                  </Typography>
                  {params.row.description && (
                    <>
                      <Typography variant="button" component={"div"}>
                        Description
                      </Typography>
                      <Typography>{params.row.description}</Typography>
                    </>
                  )}
                  {params.row.files.length > 0 && (
                    <>
                      <Typography variant="button" component={"div"}>
                        Files
                      </Typography>
                      {params.row.files.map((file: any, index: number) => (
                        <Box key={index}>
                          <Link href={config.site.imageDomain + file.file}>
                            {file.name}
                          </Link>
                        </Box>
                      ))}
                    </>
                  )}
                  <Grid container gap={2} direction="column">
                    {assignment.type === "QUIZ" &&
                      assignment.questions.map((question) => {
                        const q = question.question;
                        const questioninChosen = chosenOptions[String(q.id)];
                        const [correct, setCorrect] = useState(false);
                        useEffect(() => {
                          if (q.type === "FILL" && questioninChosen === q.fill)
                            setCorrect(true);
                        }, []);
                        return (
                          <Grid
                            container
                            className="bg-neutral-200 p-3 rounded-3xl"
                            key={q.id}
                            item
                          >
                            <Grid
                              container
                              item
                              alignItems={"center"}
                              direction={"row"}
                            >
                              <Grid flexGrow={1} item>
                                {q.question}{" "}
                                <Typography fontWeight={"medium"}>
                                  {correct && "Scored:" + q.score}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Grid
                                  container
                                  alignItems={"center"}
                                  justifyContent={"center"}
                                  width={"32px"}
                                  height={"32px"}
                                  bgcolor={
                                    correct ? "success.main" : "error.main"
                                  }
                                  className="rounded-full"
                                >
                                  {correct ? (
                                    <CheckIcon className="text-white" />
                                  ) : (
                                    <ClearOutlinedIcon className="text-white" />
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid container item>
                              {q.type === "FILL" && (
                                <TextField
                                  value={questioninChosen}
                                  disabled
                                  size="small"
                                />
                              )}
                              {q.type === "MCQ" &&
                                q.options.map((option) => {
                                  useEffect(() => {
                                    if (
                                      questioninChosen === option.id &&
                                      option.correct
                                    )
                                      setCorrect(true);
                                  }, []);

                                  return (
                                    <Grid
                                      container
                                      item
                                      alignItems={"center"}
                                      key={option.id}
                                    >
                                      <Grid item>
                                        <Radio
                                          disabled
                                          checked={
                                            questioninChosen === option.id
                                          }
                                        />
                                      </Grid>
                                      <Grid item>
                                        {option.option}
                                        {option.image && (
                                          <Box width={"200px"}>
                                            <CardMedia
                                              component="img"
                                              sx={{
                                                width: "100%",
                                              }}
                                              src={
                                                config.site.imageDomain +
                                                option.image
                                              }
                                            />
                                          </Box>
                                        )}
                                      </Grid>
                                    </Grid>
                                  );
                                })}
                            </Grid>
                          </Grid>
                        );
                      })}
                  </Grid>
                </Box>
              </ModalLay>
            </>
          );
        },
      },
    ];
    const C = [
      {
        field: "student",
        headerName: "By",
        renderCell: (params: any) => {
          return (
            <Link href={`/dashboard/students/${params.value.userId}`}>
              {params.value.user?.first_name +
                " " +
                params.value.user?.last_name}
            </Link>
          );
        },
      },
    ];
    if (role !== "STUDENT") {
      const res = A.concat(C);
      if (assignment.type === "QUIZ") {
        const D = [
          {
            field: "score",
            headerName: "Score",
            renderCell: (params: any) => {
              return params.row.score;
            },
          },
          {
            field: "correct",
            headerName: "Correct",
            renderCell: (params: any) => {
              return params.row.correct;
            },
          },
          {
            field: "accuracy",
            headerName: "Accuracy",
            renderCell: (params: any) => {
              return (
                (
                  ((params.row.correct ?? 0) / assignment._count.questions) *
                  100
                ).toFixed(2) + "%"
              );
            },
          },
        ];
        return res.concat(D).concat(B);
      }
      return res.concat(B);
    }
    return A.concat(B);
  };
  return (
    <Box className="w-100 overflow-x-auto">
      <DataGrid
        autoHeight
        hideFooter
        className="bg-white"
        columns={getColumns()}
        rows={submissions}
        checkboxSelection
      />
    </Box>
  );
};
export default GetSubmissions;
