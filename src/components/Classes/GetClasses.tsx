"use client";
import { Box, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ClassRow, { Class } from "./ClassRow";
import { reqParams } from "@/lib/consts";
import { Teacher } from "../Teachers/TeacherFields";

export const getClasses = async () => {
  const options: RequestInit = await reqParams();
  const res = await fetch(`/api/classes/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};

const GetClasses = ({
  classes,
  teachers,
}: {
  classes: Class[];
  teachers: Teacher[];
}) => {
  return (
    <Box className="w-100 overflow-x-auto">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Sections</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography component={"div"} textAlign={"center"}>
                    No Data Found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              classes.map((data, index: number) => (
                <ClassRow data={data} key={data.id} teachers={teachers} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default GetClasses;
