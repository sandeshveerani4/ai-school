"use client";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { config, reqParams } from "@/lib/consts";
import { useSession } from "next-auth/react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Submission } from "@prisma/client";
import ModalLay from "../ModalLay";
import Link from "next/link";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";

const GetSubmissions = ({ submissions }: { submissions: Submission[] }) => {
  const { data: session } = useSession();
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
        renderCell: (params: any) => {
          const [opener, setOpener] = useState(false);
          return (
            <>
              <IconButton onClick={() => setOpener(true)}>
                <EyeIcon />
              </IconButton>
              <ModalLay
                buttonTitle="View"
                isButton={false}
                opener={opener}
                setOpener={setOpener}
                buttonProps={{ color: "primary" }}
              >
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
            </>
          );
        },
      },
    ];
    const C = [
      {
        field: "student",
        headerName: "By",
        renderCell: (params: any) => {
          return (
            <Link href={`/dashboard/students/${params.value.userId}`}>
              {params.value.user?.first_name +
                " " +
                params.value.user?.last_name}
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
        autoHeight
        hideFooter
        className="bg-white"
        columns={getColumns()}
        rows={submissions}
        checkboxSelection
      />
    </Box>
  );
};
export default GetSubmissions;
