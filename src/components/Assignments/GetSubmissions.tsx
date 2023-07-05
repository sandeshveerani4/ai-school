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
import { reqParams } from "@/consts";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
export type Submission = Prisma.SubmissionGetPayload<{
  include: {
    student: { include: { user: true } };
  };
}>;
export const getSubmissions = async (id: string) => {
  try {
    const options: RequestInit = await reqParams();
    const res = await fetch(`/api/assignments/${id}/submissions`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};

const GetAssignments = ({
  reload,
  assignmentId,
}: {
  reload: boolean;
  assignmentId: string;
}) => {
  const { data: session } = useSession();
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    setData((await getSubmissions(assignmentId)) ?? data);
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
              <TableCell>By</TableCell>
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
                  <TableCell>{data.id}</TableCell>
                  <TableCell>
                    {data.student.user.first_name} {data.student.user.last_name}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      LinkComponent={Link}
                      href={`/dashboard/assignments/${data["id"]}/submissions/`}
                      className="mr-2"
                    >
                      View Submissions
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
