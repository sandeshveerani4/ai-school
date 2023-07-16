"use client";
import { Box, Grid, Skeleton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Radio from "@mui/material/Radio";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CardMedia from "@mui/material/CardMedia";
import Loading from "@/app/dashboard/loading";
import Link from "next/link";
import { config, reqParams } from "@/lib/consts";
import { Prisma } from "@prisma/client";
import ModalLay from "../ModalLay";
export type Question = Prisma.QuestionGetPayload<{
  include: { options: true; topic: true };
}>;
export const getQuestions = async () => {
  try {
    const options: RequestInit = await reqParams();
    const res = await fetch(`/api/questions/`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};

const GetQuestions = ({ questions }: { questions: Question[] }) => {
  return (
    <Box className="w-100 overflow-x-auto">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography component={"div"} textAlign={"center"}>
                    No Data Found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              questions.map((data, index: number) => (
                <TableRow
                  key={data.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data.id}</TableCell>
                  <TableCell>{data.question}</TableCell>
                  <TableCell>{data.topic.title}</TableCell>
                  <TableCell>
                    {data.image && (
                      <Box width={"200px"}>
                        <CardMedia
                          component="img"
                          sx={{
                            width: "100%",
                          }}
                          src={config.site.imageDomain + data.image}
                        />
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>{data.score}</TableCell>
                  <TableCell>
                    <ModalLay
                      buttonTitle="View Options"
                      buttonProps={{ color: "primary" }}
                    >
                      <Typography variant="h6" component="h2">
                        Options
                      </Typography>
                      {data.type === "FILL"
                        ? `Correct answer: ${data.fill}`
                        : data.options.map((option) => (
                            <Grid
                              container
                              justifyContent={"center"}
                              alignItems={"center"}
                              className="my-2 bg-neutral-200 rounded-2xl"
                            >
                              <Grid item>
                                <Radio checked={option.correct} />
                              </Grid>
                              <Grid item flexGrow={1}>
                                {option.option}
                                {option.image && (
                                  <Box width={"200px"}>
                                    <CardMedia
                                      component="img"
                                      sx={{
                                        width: "100%",
                                      }}
                                      src={
                                        config.site.imageDomain + option.image
                                      }
                                    />
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          ))}
                    </ModalLay>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default GetQuestions;
