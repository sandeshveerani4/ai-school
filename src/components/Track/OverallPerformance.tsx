"use client";
import { Box } from "@mui/material";
import React, { useState } from "react";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Class } from "../Classes/ClassRow";
import { DataGrid } from "@mui/x-data-grid";

Chart.register(CategoryScale);

const OverallPerformance = ({
  overallTrack,
  classes,
}: {
  overallTrack: any;
  classes: Class[];
}) => {
  const [chartData, setChartData] = useState({
    labels: overallTrack.map(
      (data: any) => classes.find((cls) => cls.id === data.classId)?.name
    ),
    datasets: [
      {
        label: "Overall Performance ",
        data: overallTrack.map((data: any) => data._sum.xp),
      },
    ],
  });
  return (
    <Box>
      <Bar data={chartData} />
      <DataGrid
        autoHeight
        sx={{ bgcolor: "white" }}
        columns={[
          {
            field: "name",
            headerName: "Class",
            renderCell: (params) => {
              return classes.find((cls) => cls.id === params.row.classId)?.name;
            },
          },
          {
            field: "xp",
            headerName: "XP",
            width: 150,
            renderCell: (params) => {
              return params.row._sum.xp;
            },
          },
        ]}
        rowSelection={false}
        rows={overallTrack}
        hideFooter
      />
    </Box>
  );
};

export default OverallPerformance;
