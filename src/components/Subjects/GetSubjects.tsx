"use client";
import { Box, Grid, Skeleton, TextField, Typography } from "@mui/material";
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
export type Subject = Prisma.SubjectGetPayload<{
  include: {
    class: true;
    section: true;
    teacher: { include: { user: true } };
  };
}>;
export const getSubjects = async (classId: number, sectionId: number) => {
  try {
    const options: RequestInit = await reqParams();
    const res = await fetch(`/api/subjects/${classId}/${sectionId}`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};

const GetSubjects = ({
  reload,
  classId,
  sectionId,
}: {
  reload: boolean;
  classId: number;
  sectionId: number;
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    setLoading(true);
    setData(await getSubjects(classId, sectionId));
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    loadData();
  }, [classId, sectionId]);
  useEffect(() => {
    if (reload) loadData();
  }, [reload]);
  return (
    <Box className="w-100 overflow-x-auto">
      {loading ? (
        <Loading />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Subject Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && data.length == 0 ? (
                <Typography>No Data Found</Typography>
              ) : (
                data.map((data: Subject, index: number) => (
                  <TableRow
                    key={data.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{data.id}</TableCell>
                    <TableCell>{data.name}</TableCell>
                    <TableCell>{data.class?.name}</TableCell>
                    <TableCell>{data.section?.name}</TableCell>
                    <TableCell>
                      {data.teacher?.user?.first_name}{" "}
                      {data.teacher?.user?.last_name}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        LinkComponent={Link}
                        href={`/dashboard/subjects/${data.id}/topics`}
                        className="mr-2"
                      >
                        View Topics
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
export default GetSubjects;
