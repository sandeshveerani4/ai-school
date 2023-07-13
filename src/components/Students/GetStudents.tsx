"use client";
import { Box, CardMedia } from "@mui/material";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Link from "next/link";
import { Student } from "./StudentFields";
import { config, reqParams } from "@/lib/consts";
import ModalLay from "../ModalLay";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
const StudentItem = ({
  data,
  router,
}: {
  data: Student;
  router: AppRouterInstance;
}) => {
  const [show, setShow] = useState(false);
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        {data.pictureURL && (
          <CardMedia
            component="img"
            className="rounded-lg my-3"
            sx={{
              width: "64px",
            }}
            src={config.site.imageDomain + data.pictureURL}
          />
        )}
      </TableCell>
      <TableCell>{data["username"]}</TableCell>
      <TableCell>{data.first_name}</TableCell>
      <TableCell>{data.last_name}</TableCell>
      <TableCell>
        {data.student?.class?.name} {data.student?.section.name}
      </TableCell>
      <TableCell>
        <IconButton
          LinkComponent={Link}
          href={`/dashboard/students/${data["id"]}`}
          className="mr-2"
        >
          <EyeIcon />
        </IconButton>
        <IconButton onClick={() => setShow(true)}>
          <DeleteIcon />
        </IconButton>
        <ModalLay isButton={false} opener={show} setOpener={setShow}>
          <Typography variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          <Typography>
            Are you sure you want to delete this entity? All assignments,
            messages, results, etc of this candidate will be deleted
            permanently.
          </Typography>
          <Button
            variant="contained"
            color="error"
            className="mt-2"
            onClick={async () => {
              await deleteStudent(data["id"]);
              router.refresh();
              setShow(false);
            }}
          >
            Confirm
          </Button>
        </ModalLay>
      </TableCell>
    </TableRow>
  );
};
const deleteStudent = async (id: number) => {
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
const GetStudents = ({ students }: { students: Student[] }) => {
  const router = useRouter();

  return (
    <Box className="w-100 overflow-x-auto">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography component={"div"} textAlign={"center"}>
                    No Data Found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              students.map((data) => (
                <StudentItem data={data} router={router} key={data.id} />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default GetStudents;
