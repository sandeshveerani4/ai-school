"use client";
import {
  Box,
  Grid,
  MenuItem,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
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
import { config, reqParams } from "@/lib/consts";
import { Prisma, Section, Topic } from "@prisma/client";
import ModalLay from "../ModalLay";
import { inputWhite } from "../Students/StudentFields";
import { Class } from "../Classes/ClassRow";
export type Question = Prisma.QuestionGetPayload<{
  include: { options: true; topic: true };
}>;
export const getQuestions = async (topicId: number) => {
  try {
    const options: RequestInit = await reqParams();
    const res = await fetch(`/api/questions/?topicId=${topicId}`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};

const GetQuestions = ({ classes }: { classes: Class[] }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classId, setClass] = useState(0);
  const [sectionId, setSection] = useState(0);
  const [topicId, setTopic] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const classChanged = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setClass(Number(e.target.value));
    setSections(
      classes.filter((val) => val.id === Number(e.target.value))[0].sections
    );
  };
  useEffect(() => {
    if (classId && sectionId) {
      setTopics(
        classes
          .filter((val) => val.id === Number(classId))[0]
          .sections.filter((val) => val.id === Number(sectionId))[0]
          ?.subjects[0]?.topics ?? []
      );
    }
  }, [classId, sectionId]);
  useEffect(() => {
    if (classId && sectionId && topicId) {
      (async () => {
        setQuestions(await getQuestions(topicId));
      })();
    }
  }, [classId, sectionId, topicId]);
  return (
    <>
      <Box className="mb-2">
        <TextField
          label="Class"
          sx={{ width: "150px", ...inputWhite }}
          size="small"
          onChange={(e) => classChanged(e)}
          select
        >
          {classes.length !== 0 &&
            classes.map((item, index) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label="Section"
          sx={{ width: "150px", marginLeft: 1, ...inputWhite }}
          onChange={(e) => {
            setSection(e.target.value as unknown as number);
          }}
          size="small"
          select
        >
          {sections.length !== 0 &&
            sections.map((item, index) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label="Topic"
          sx={{ width: "150px", marginLeft: 1, ...inputWhite }}
          onChange={(e) => {
            setTopic(e.target.value as unknown as number);
          }}
          size="small"
          select
        >
          {topics.length !== 0 &&
            topics.map((item, index) => (
              <MenuItem key={item.id} value={item.id}>
                {item.title}
              </MenuItem>
            ))}
        </TextField>
      </Box>
      {sectionId !== 0 && classId !== 0 && topicId !== 0 && (
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
                                            config.site.imageDomain +
                                            option.image
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
      )}
    </>
  );
};
export default GetQuestions;
