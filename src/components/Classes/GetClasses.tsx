"use client";
import { Box, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getSession } from "next-auth/react";
import Loading from "@/app/dashboard/loading";
import ModalLay from "../ModalLay";
import FormWithLoading from "../FormWithLoading";
import ClassRow, { Class } from "./ClassRow";
import { reqParams } from "@/lib/consts";

export const getClasses = async () => {
  const options: RequestInit = await reqParams();
  const res = await fetch(`/api/classes/`, options);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return await res.json();
};

const GetClasses = ({ reload }: { reload: boolean }) => {
  const [fetchedData, setData] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    setData((await getClasses()) ?? fetchedData);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (reload) {
      loadData();
    }
  }, [reload]);
  return (
    <Box className="w-100 overflow-x-auto">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Class Teacher</TableCell>
              <TableCell>Sections</TableCell>
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
                <ClassRow data={data} key={data.id} />
              ))
            )}
          </TableBody>
        </Table>
        {loading && <Loading />}
      </TableContainer>
    </Box>
  );
};
export default GetClasses;
