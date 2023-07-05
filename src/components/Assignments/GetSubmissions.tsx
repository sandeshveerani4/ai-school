"use client";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { config, reqParams } from "@/consts";
import { useSession } from "next-auth/react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Submission } from "@prisma/client";
import ModalLay from "../ModalLay";
import Link from "next/link";
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
    setLoading(true);
    setData((await getSubmissions(assignmentId)) ?? data);
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (reload) loadData();
  }, [reload]);
  const getColumns = () => {
    const A = [{ field: "id", headerName: "ID" }];
    const B = [
      {
        field: "createdAt",
        headerName: "Submitted On:",
        width: 150,
        flex: 1,
        renderCell: (params: any) => new Date(params.value).toLocaleString(),
      },
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params: any) => (
          <ModalLay buttonTitle="View" buttonProps={{ color: "primary" }}>
            <Box>
              <Typography variant="button" component={"div"}>
                Submitted On:
              </Typography>
              <Typography>
                {new Date(params.row.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="button" component={"div"}>
                Description
              </Typography>
              <Typography>{params.row.description}</Typography>
              <Typography variant="button" component={"div"}>
                Files
              </Typography>
              {params.row.files.map((file: any, index: number) => (
                <Box key={index}>
                  <Link href={config.site.imageDomain + file.file}>
                    {file.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </ModalLay>
        ),
      },
    ];
    const C = [
      {
        field: "student",
        headerName: "By",
        renderCell: (params: any) => {
          return (
            <Link href={`/dashboard/students/${params.value.userId}`}>
              {params.value.user.first_name + " " + params.value.user.last_name}
            </Link>
          );
        },
      },
    ];
    if (session && session.user.role !== "STUDENT")
      return A.concat(C).concat(B);
    return A.concat(B);
  };
  return (
    <Box className="w-100 overflow-x-auto">
      <DataGrid
        loading={loading}
        autoHeight
        hideFooter
        className="bg-white"
        columns={getColumns()}
        rows={data}
        checkboxSelection
      />
    </Box>
  );
};
export default GetAssignments;
