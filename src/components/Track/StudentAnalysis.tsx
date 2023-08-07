"use client";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Class } from "../Classes/ClassRow";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StudentAnalysisType } from "@/lib/srv-funcs";
const StudentAnalysis = ({
  studentAnalysis,
  classes,
}: {
  studentAnalysis: StudentAnalysisType[];
  classes: Class[];
}) => {
  const router = useRouter();
  return (
    <DataGrid
      autoHeight
      sx={{ bgcolor: "white" }}
      getRowId={(row) => row.userId}
      columns={[
        {
          field: "userId",
          headerName: "Id",
        },
        {
          field: "name",
          headerName: "Name",
          renderCell: (params) => params.row.first_name + params.row.last_name,
        },
        {
          field: "class",
          headerName: "Class",
        },
        {
          field: "section",
          headerName: "Section",
        },
        { field: "xp", headerName: "XP" },
        { field: "avg", headerName: "Average Test Score" },
        { field: "count", headerName: "Total Submissions" },
        {
          field: "action",
          headerName: "Action",
          renderCell: (params) => (
            <IconButton
              LinkComponent={Link}
              href={`/dashboard/students/${params.row.userId}`}
            >
              <VisibilityOutlinedIcon />
            </IconButton>
          ),
        },
      ]}
      rowSelection={false}
      rows={studentAnalysis}
      hideFooter
    />
  );
};

export default StudentAnalysis;
