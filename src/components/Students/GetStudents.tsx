"use client";
import { Box, Grid, Skeleton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Loading from "@/app/dashboard/loading";
import Link from "next/link";
import { Student } from "./StudentFields";
import { reqParams } from "@/lib/consts";

export const getStudents = async () => {
  try {
    const options: RequestInit = await reqParams();
    const res = await fetch(`/api/students/`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};
export const deleteStudent = async (id: string) => {
  try {
    const options: RequestInit = {
      ...(await reqParams()),
      method: "DELETE",
    };
    const res = await fetch(`/api/students/${id}`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};

const GetStudents = ({ reload }: { reload: boolean }) => {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const deleteStd = async (id: number) => {
    await deleteStudent(String(id));
    loadData();
  };
  const loadData = async () => {
    setData((await getStudents()) ?? data);
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
              <TableCell>Username</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && data.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography component={"div"} textAlign={"center"}>
                    No Data Found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((data, index: number) => (
                <TableRow
                  key={data.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data["id"]}</TableCell>
                  <TableCell>{data["username"]}</TableCell>
                  <TableCell>{data.first_name}</TableCell>
                  <TableCell>{data.last_name}</TableCell>
                  <TableCell>
                    {data.student?.class?.name} {data.student?.section.name}
                  </TableCell>
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
