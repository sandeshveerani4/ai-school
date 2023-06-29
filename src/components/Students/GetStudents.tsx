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
import { getSession } from "next-auth/react";
import Loading from "@/app/dashboard/loading";
import Link from "next/link";
import { Student } from "./StudentFields";

export const getStudents = async (token: string) => {
  const options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    cache: "no-store",
  };
  const res = await fetch(`/api/students/`, options);
  return await res.json();
};
export const deleteStudent = async (token: string, id: string) => {
  const options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    method: "DELETE",
    cache: "no-store",
  };
  const res = await fetch(`/api/students/${id}`, options);
  return await res.json();
};

const GetStudents = ({ reload }: { reload: boolean }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const deleteStd = async (id: number) => {
    const session = await getSession();
    if (session) {
      await deleteStudent(session?.user.accessToken, String(id));
      loadData();
    }
  };
  const loadData = async () => {
    const session = await getSession();
    if (session) {
      setData(await getStudents(session.user.accessToken));
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  });
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
              <TableCell>Username</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && data.length == 0 ? (
              <Box>No Data Found</Box>
            ) : (
              data.map((data: Student, index: number) => (
                <TableRow
                  key={data.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data["id"]}</TableCell>
                  <TableCell>{data["username"]}</TableCell>
                  <TableCell>{data.profile?.first_name}</TableCell>
                  <TableCell>{data.profile?.last_name}</TableCell>
                  <TableCell>{data.student?.class?.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      LinkComponent={Link}
                      href={`/dashboard/students/${data["id"]}`}
                      className="mr-2"
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => deleteStd(data.id)}
                      color="error"
                    >
                      Delete
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
export default GetStudents;
