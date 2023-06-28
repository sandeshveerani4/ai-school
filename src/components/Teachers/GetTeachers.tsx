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
import { Teacher } from "./TeacherFields";

export const getTeachers = async (token: string) => {
  const options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    cache: "no-store",
  };
  const res = await fetch(`http://localhost:3000/api/teachers/`, options);
  return await res.json();
};
const GetTeachers = () => {
  const [fetchedData, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        setData(await getTeachers(session.user.accessToken));
        setLoading(false);
      }
    })();
  }, []);
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
            {!loading && fetchedData.length == 0 ? (
              <Box>No Data Found</Box>
            ) : (
              fetchedData.map((data: Teacher, index: number) => (
                <TableRow
                  key={data.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data["id"]}</TableCell>
                  <TableCell>{data["username"]}</TableCell>
                  <TableCell>{data.profile?.first_name}</TableCell>
                  <TableCell>{data.profile?.last_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      LinkComponent={Link}
                      href={`/dashboard/teachers/${data["id"]}`}
                      className="mr-2"
                    >
                      View Details
                    </Button>
                    <Button variant="outlined" color="error">
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
export default GetTeachers;
