import React from "react";
import { Box, IconButton } from "@mui/material";
import { Discussion } from "@/app/dashboard/discussions/client";
import { DataGrid } from "@mui/x-data-grid";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import Link from "next/link";
import { Session } from "next-auth";
const GetDiscussions = ({
  discussions,
  session,
}: {
  discussions: Discussion[];
  session: Session | null;
}) => {
  return (
    <Box>
      <DataGrid
        autoHeight
        sx={{ bgcolor: "white" }}
        columns={[
          { field: "id", headerName: "ID" },
          { field: "topic", headerName: "Topic", width: 150 },
          {
            field: "teacher",
            headerName:
              session?.user.role === "STUDENT" ? "Teacher" : "Student",
            width: 150,
          },
          {
            field: "action",
            headerName: "Action",
            renderCell: (params) => {
              return (
                <>
                  <IconButton
                    LinkComponent={Link}
                    href={`/dashboard/discussions/${params.row.id}`}
                  >
                    <EyeIcon />
                  </IconButton>
                </>
              );
            },
          },
        ]}
        rowSelection={false}
        rows={discussions.map((discussion, index) => {
          const teacherDetails =
            session?.user.role === "STUDENT"
              ? discussion.topic.subject.section.classTeacher.user
              : discussion.student.user;
          return {
            id: discussion.id,
            topic: discussion.topic.title,
            teacher: teacherDetails.first_name + " " + teacherDetails.last_name,
          };
        })}
        hideFooter
      />
    </Box>
  );
};

export default GetDiscussions;
