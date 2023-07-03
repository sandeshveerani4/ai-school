"use client";
import { Box, Grid, Skeleton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Loading from "@/app/dashboard/loading";
import Link from "next/link";
import { reqParams } from "@/consts";
import { Prisma } from "@prisma/client";
export type Assignment = Prisma.AssignmentGetPayload<{
  include: {
    _count: { select: { submissions: true } };
    topic: {
      include: {
        subject: {
          include: {
            class: true;
            section: true;
            teacher: { include: { user: true } };
          };
        };
      };
    };
  };
}>;
export const getAssignments = async () => {
  try {
    const options: RequestInit = await reqParams();
    const res = await fetch(`/api/assignments/`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};

const GetAssignments = ({ reload }: { reload: boolean }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    setData((await getAssignments()) ?? []);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (reload) loadData();
  }, [reload]);
  return (
    <Box className="w-100 overflow-x-auto">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Submissions</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Given By</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Section</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && data.length == 0 ? (
              <Box>No Data Found</Box>
            ) : (
              data.map((data: Assignment, index: number) => (
                <TableRow
                  key={data.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data.id}</TableCell>
                  <TableCell>{data.title}</TableCell>
                  <TableCell>{data._count.submissions}</TableCell>
                  <TableCell>{data.topic.title}</TableCell>
                  <TableCell>
                    {data.topic.subject.teacher.user.first_name}{" "}
                    {data.topic.subject.teacher.user.last_name}
                  </TableCell>
                  <TableCell>{data.topic.subject.name}</TableCell>
                  <TableCell>{data.topic.subject.class.name}</TableCell>
                  <TableCell>{data.topic.subject.section.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      LinkComponent={Link}
                      href={`/dashboard/assignments/${data["id"]}`}
                      className="mr-2"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {loading && <Loading />}
      </TableContainer>
    </Box>
  );
};
export default GetAssignments;
