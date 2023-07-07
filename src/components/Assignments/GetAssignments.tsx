"use client";
import { Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import { reqParams } from "@/lib/consts";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
export type Assignment = Prisma.AssignmentGetPayload<{
  include: {
    _count: { select: { submissions: true } };
    submissions: true;
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
const GetAssignments = ({ assignments }: { assignments: Assignment[] }) => {
  const { data: session } = useSession();
  return (
    <Box className="w-100 overflow-x-auto">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              {session?.user.role !== "STUDENT" && (
                <TableCell>Submissions</TableCell>
              )}
              <TableCell>Deadline</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Given By</TableCell>
              {session && session.user.role !== "STUDENT" && (
                <TableCell>Class</TableCell>
              )}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((data, index: number) => (
              <TableRow
                key={data.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  {data.title}{" "}
                  <Box>
                    <Chip
                      label={data.type}
                      variant="outlined"
                      size="small"
                      color={data.type === "QUIZ" ? "warning" : "info"}
                    />
                    {session && session?.user.role !== "STUDENT" && (
                      <>
                        {" "}
                        <Chip
                          label={data.visible ? "Visible" : "Not visible"}
                          variant="outlined"
                          size="small"
                          color={data.visible ? "success" : "default"}
                        />
                      </>
                    )}{" "}
                    {!data.enabled && (
                      <Chip
                        label={"Disabled"}
                        variant="outlined"
                        size="small"
                        color={"default"}
                      />
                    )}
                  </Box>
                </TableCell>
                {session && session?.user.role !== "STUDENT" && (
                  <TableCell>{data._count.submissions}</TableCell>
                )}
                <TableCell>
                  {new Date(data.deadline).toLocaleString()}
                </TableCell>
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
                  <IconButton
                    LinkComponent={Link}
                    href={`/dashboard/assignments/${data["id"]}/`}
                    className="mr-2"
                  >
                    <EyeIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default GetAssignments;
