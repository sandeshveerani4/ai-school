"use client";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "next/link";
import { Teacher } from "./TeacherFields";
import ModalLay from "../ModalLay";
import { reqParams } from "@/lib/consts";

import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useRouter } from "next/navigation";
export const getTeachers = async () => {
  const options: RequestInit = await reqParams();
  const res = await fetch(`/api/teachers/`, options);
  return await res.json();
};
const deleteTeacher = async (id: number) => {
  try {
    const options: RequestInit = {
      ...(await reqParams()),
      method: "DELETE",
    };
    const res = await fetch(`/api/teachers/${id}`, options);
    return await res.json();
  } catch (e) {
    console.error(e);
  }
};
const GetTeachers = ({ teachers }: { teachers: Teacher[] }) => {
  const [show, setShow] = useState(false);
  const router = useRouter();
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography component={"div"} textAlign={"center"}>
                    No Data Found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              teachers.map((data, index: number) => (
                <TableRow
                  key={data.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data["id"]}</TableCell>
                  <TableCell>{data["username"]}</TableCell>
                  <TableCell>{data.first_name}</TableCell>
                  <TableCell>{data.last_name}</TableCell>
                  <TableCell>
                    <IconButton
                      LinkComponent={Link}
                      href={`/dashboard/teachers/${data["id"]}`}
                      className="mr-2"
                    >
                      <EyeIcon />
                    </IconButton>
                    <IconButton onClick={() => setShow(true)}>
                      <DeleteIcon />
                    </IconButton>
                    <ModalLay
                      isButton={false}
                      opener={show}
                      setOpener={setShow}
                    >
                      <Typography variant="h6" component="h2">
                        Confirm Deletion
                      </Typography>
                      <Typography>
                        Are you sure you want to delete this entity?
                      </Typography>
                      <Button
                        onClick={async () => {
                          await deleteTeacher(data["id"]);
                          router.refresh();
                          setShow(false);
                        }}
                        variant="contained"
                        color="error"
                        className="mt-2"
                      >
                        Confirm
                      </Button>
                    </ModalLay>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default GetTeachers;
