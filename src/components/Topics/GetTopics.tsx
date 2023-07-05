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
export type Topic = Prisma.TopicGetPayload<{
  include: {
    subject: { include: { class: true; section: true } };
  };
}>;
export const getTopics = async (subjectId: string) => {
  try {
    const options: RequestInit = await reqParams();
    const res = await fetch(`/api/subjects/${subjectId}/topics`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};

const GetTopics = ({
  reload,
  subjectId,
}: {
  reload: boolean;
  subjectId: string;
}) => {
  const [data, setData] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    setLoading(true);
    setData((await getTopics(subjectId)) ?? data);
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
      {loading ? (
        <Loading />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length == 0 ? (
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
                    <TableCell>{data.title}</TableCell>
                    <TableCell>{data.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        LinkComponent={Link}
                        href={`/dashboard/subjects/${data.id}/topics`}
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
        </TableContainer>
      )}
    </Box>
  );
};
export default GetTopics;
