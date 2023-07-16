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
    pcolor,
  }: {
    title: string;
    number: number;
    children?: React.ReactNode;
    pcolor: string;
  }) => (
    <Grid container direction={"column"} md={3} xs={12} item>
      <Box
        sx={{
          // outline: "2px solid #f7f7f7",
          /* borderLeft: "5px solid",
          borderColor: pcolor, */
          userSelect: "none",
          background: pcolor,
          "&:hover": {
            // boxShadow: "1px 0 10px -5px black",
            transform: "skewY(-5deg) scale(1.1)",
          },
          transition: "all 0.2s ease-in-out",
        }}
        className="rounded-lg p-3 m-2"
      >
        <Typography fontSize={"small"} color={"white"} fontWeight={"medium"}>
          {title}
        </Typography>
        <Typography
          textTransform={"uppercase"}
          variant="h4"
          fontWeight={"medium"}
          sx={{
            color: "white",
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
      <Item
        title="Questions"
        number={stats.questions}
        pcolor="linear-gradient(45deg, #f12711, #f5b119)"
      ></Item>
      <Item
        title="Assignments"
        number={stats.assignments}
        pcolor="linear-gradient(45deg,#0540e6,#00f2dc)"
      ></Item>
      <Item
        title="Students"
        number={stats.students}
        pcolor="linear-gradient(45deg,#56068d,#f347d6)"
      ></Item>
      <Item
        title="Teachers"
        number={stats.teachers}
        pcolor="linear-gradient(45deg,#45b649,#dce35b)"
      ></Item>
    </Grid>
  );
};

export default Stats;
