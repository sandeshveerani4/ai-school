"use client";
import { Topic } from "@/components/Topics/GetTopics";
import { Box, Grid, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Session } from "next-auth";
import Link from "next/link";
import React from "react";

const Client = ({
  topics,
  session,
}: {
  topics: Topic[];
  session: Session | null;
}) => {
  return (
    <Grid container direction={"column"} gap={1}>
      <DataGrid
        sx={{ bgcolor: "white" }}
        columns={[
          { field: "title", headerName: "Title" },
          {
            field: "_",
            headerName: "Actions",
            renderCell: (params) => (
              <Button
                variant="contained"
                size="small"
                LinkComponent={Link}
                href={`/dashboard/practise/${params.id}`}
              >
                Practise Now
              </Button>
            ),
            minWidth: 200,
          },
        ]}
        rows={topics}
        hideFooter
        disableRowSelectionOnClick
      />
    </Grid>
  );
};

export default Client;
