"use client";
import { Box, Grid, Skeleton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import Chip from "@mui/material/Chip";
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
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const [data, setData] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    setData((await getAssignments()) ?? data);
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
              {session?.user.role !== "STUDENT" && (
                <TableCell>Submissions</TableCell>
              )}
              <TableCell>Topic</TableCell>
              <TableCell>Given By</TableCell>
              {session && session.user.role !== "STUDENT" && (
                <TableCell>Class</TableCell>
              )}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && data.length == 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
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
                    {data.title}{" "}
                    <Box>
                      <Chip
                        label={data.type}
                        variant="filled"
                        size="small"
                        color={data.type === "QUIZ" ? "warning" : "info"}
                      />
                      {session && session?.user.role !== "STUDENT" && (
                        <>
                          {" "}
                          <Chip
                            label={data.visible ? "Visible" : "Not visible"}
                            variant="filled"
                            size="small"
                            color={data.visible ? "success" : "default"}
                          />{" "}
                          <Chip
                            label={data.enabled ? "Enabled" : "Disabled"}
                            variant="filled"
                            size="small"
                            color={data.enabled ? "success" : "default"}
                          />
                        </>
                      )}
                    </Box>
                  </TableCell>
                  {session && session?.user.role !== "STUDENT" && (
                    <TableCell>{data._count.submissions}</TableCell>
                  )}
                  <TableCell>{data.topic.title}</TableCell>
                  <TableCell>
                    {data.topic.subject.teacher.user.first_name}{" "}
                    {data.topic.subject.teacher.user.last_name}
                  </TableCell>
                  {session && session.user.role !== "STUDENT" && (
                    <TableCell>
                      {data.topic.subject.class.name}{" "}
                      {data.topic.subject.section.name}
                    </TableCell>
                  )}
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
