"use client";
import { Box, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getSession } from "next-auth/react";
import Loading from "@/app/dashboard/loading";
import { Class } from "@prisma/client";

export const getClasses = async (token: string) => {
  const options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    cache: "no-store",
  };
  const res = await fetch(`/api/classes/`, options);
  return await res.json();
};
export const getSections = async (token: string, classId: number) => {
  const options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      authorization: token,
    },
    cache: "no-store",
  };
  const res = await fetch(`/api/classes/sections?classId=${classId}`, options);
  return await res.json();
};
const GetClasses = ({ reload }: { reload: boolean }) => {
  const [fetchedData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadData = async () => {
    const session = await getSession();
    if (session) {
      setData(await getClasses(session.user.accessToken));
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  });
  useEffect(() => {
    if (reload) loadData();
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
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && fetchedData.length == 0 ? (
              <Box>No Data Found</Box>
            ) : (
              fetchedData.map((data: Class, index: number) => (
                <TableRow
                  key={data.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{data["id"]}</TableCell>
                  <TableCell>{data["name"]}</TableCell>
                  <TableCell>{data["rank"]}</TableCell>
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
export default GetClasses;
