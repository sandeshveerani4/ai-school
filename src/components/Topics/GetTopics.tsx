"use client";
import { Box, Grid, IconButton, Skeleton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { reqParams } from "@/lib/consts";
import { Prisma } from "@prisma/client";
import DeleteOulinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModalLay from "../ModalLay";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
export type Topic = Prisma.TopicGetPayload<{
  include: {
    subject: { include: { class: true; section: true } };
  };
}>;
const deleteTopic = async (id: number) => {
  try {
    const options: RequestInit = {
      ...(await reqParams()),
      method: "DELETE",
    };
    const res = await fetch(`/api/topics/${id}`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
}
export const getTopics = async (subjectId: string) => {
  try {
    const options: RequestInit = await reqParams();
    const res = await fetch(`/api/subjects/${subjectId}/topics`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};
const TopicItem = ({ data, router }: { data: Topic, router: AppRouterInstance }) => {
  const [opener, setOpener] = useState(false);

  return (<TableRow
    key={data.id}
    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
  >
    <TableCell>{data.id}</TableCell>
    <TableCell>{data.title}</TableCell>
    <TableCell>{data.description}</TableCell>
    <TableCell>
      <IconButton onClick={() => setOpener(!opener)}>
        <DeleteOulinedIcon />
      </IconButton>
      <ModalLay isButton={false} opener={opener} setOpener={setOpener}>
        <Typography variant="h6" component="h2">
          Confirm Deletion
        </Typography>
        <Typography>
          Are you sure you want to delete this entity?
        </Typography>
        <Button
          variant="contained"
          color="error"
          className="mt-2"
          onClick={async () => {
            await deleteTopic(data["id"]);
            router.refresh();
            setOpener(false);
          }}
        >
          Confirm
        </Button>
      </ModalLay>
    </TableCell>
  </TableRow>)
}
const GetTopics = ({ topics }: { topics: Topic[] }) => {
  const router = useRouter();
  return (
    <Box className="w-100 overflow-x-auto">
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
            {topics.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography component={"div"} textAlign={"center"}>
                    No Data Found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              topics.map((data) => (
                <TopicItem data={data} router={router} key={data.id} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default GetTopics;
