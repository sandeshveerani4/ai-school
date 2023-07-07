"use client";
import { Box, Grid, Skeleton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
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
import { Teacher } from "./TeacherFields";
import ModalLay from "../ModalLay";
import { reqParams } from "@/lib/consts";

export const getTeachers = async () => {
  const options: RequestInit = await reqParams();
  const res = await fetch(`/api/teachers/`, options);
  return await res.json();
};
const GetTeachers = ({ reload }: { reload: boolean }) => {
  const [fetchedData, setData] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setData((await getTeachers()) ?? fetchedData);
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && fetchedData.length == 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography component={"div"} textAlign={"center"}>
                    No Data Found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              fetchedData.map((data, index: number) => (
                <TableRow
                  key={data.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data["id"]}</TableCell>
                  <TableCell>{data["username"]}</TableCell>
                  <TableCell>{data.first_name}</TableCell>
                  <TableCell>{data.last_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      LinkComponent={Link}
                      href={`/dashboard/teachers/${data["id"]}`}
                      className="mr-2"
                    >
                      View Details
                    </Button>
                    <ModalLay buttonTitle="Delete Teacher">
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
        {loading && <Loading />}
      </TableContainer>
    </Box>
  );
};
export default GetTeachers;
