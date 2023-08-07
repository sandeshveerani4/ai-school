"use client";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Class } from "../Classes/ClassRow";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";
import { assignmentAnalysisType } from "@/app/dashboard/track/client";
import Link from "next/link";
const AssignmentAnalysis = ({
  assignmentAnalysis,
  classes,
}: {
  assignmentAnalysis: assignmentAnalysisType[];
  classes: Class[];
}) => {
  const router = useRouter();
  return (
    <DataGrid
      autoHeight
      sx={{ bgcolor: "white" }}
      columns={[
        {
          field: "id",
          headerName: "Id",
        },
        {
          field: "title",
          headerName: "Title",
        },
        {
          field: "submissions",
          headerName: "Submissions",
          renderCell: (params) => <Box>{params.row._count.submissions}</Box>,
        },
        {
          field: "action",
          headerName: "Action",
          renderCell: (params) => (
            <IconButton
              LinkComponent={Link}
              href={`/dashboard/assignments/${params.row.id}`}
            >
              <VisibilityOutlinedIcon />
            </IconButton>
          ),
        },
      ]}
      rowSelection={false}
      rows={assignmentAnalysis}
      hideFooter
    />
  );
};

export default AssignmentAnalysis;
