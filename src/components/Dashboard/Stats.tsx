import React from "react";
import { Grid, Typography, Box } from "@mui/material";
export interface Stats {
  students: number;
  teachers: number;
  assignments: number;
  questions: number;
}
const Stats = ({ stats }: { stats: Stats }) => {
  const Item = ({
    title,
    number,
    children,
  }: {
    title: string;
    number: number;
    children?: React.ReactNode;
  }) => (
    <Grid container direction={"column"} md={3} xs={12} item>
      <Box
        sx={{
          borderLeft: "5px solid",
          borderColor: "secondary.main",
          userSelect: "none",
          "&:hover": {
            boxShadow: "1px 0 30px -28px black",
          },
        }}
        className="rounded-lg p-3 bg-white m-2"
      >
        <Typography
          textTransform={"uppercase"}
          fontSize={"small"}
          color={"InactiveCaptionText"}
          fontWeight={"medium"}
        >
          {title}
        </Typography>
        <Typography
          textTransform={"uppercase"}
          variant="h4"
          fontWeight={"medium"}
          sx={{
            color: "secondary.main",
          }}
        >
          {number}
        </Typography>
        {children}
      </Box>
    </Grid>
  );
  return (
    <Grid container>
      <Item title="Students" number={stats.students}></Item>
      <Item title="Teachers" number={stats.teachers}></Item>
      <Item title="Assignments" number={stats.assignments}></Item>
      <Item title="Questions" number={stats.questions}></Item>
    </Grid>
  );
};

export default Stats;
