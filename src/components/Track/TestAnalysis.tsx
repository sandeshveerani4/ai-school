"use client";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import { Class } from "../Classes/ClassRow";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";
import Link from "next/link";
export type testAnalysisType = {
  id: number;
  title: string;
  result: number;
  classId: number;
  sectionId: number;
  attempts: number;
};
const TestAnalysis = ({
  testAnalysis,
  classes,
}: {
  testAnalysis: testAnalysisType[];
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
          field: "result",
          headerName: "Average %",
        },
        {
          field: "classId",
          headerName: "Class",
        },
        {
          field: "sectionId",
          headerName: "Section",
        },
        {
          field: "attempts",
          headerName: "Total Test Attempts",
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
      rows={testAnalysis}
      hideFooter
    />
  );
};

export default TestAnalysis;
