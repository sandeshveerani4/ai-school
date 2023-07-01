import React from "react";
import { Grid, Typography, Box } from "@mui/material";
const Stats = () => {
  const Item = ({
    title,
    number,
    children,
  }: {
    title: string;
    number: number;
    children?: React.ReactNode;
  }) => (
    <Grid
      container
      direction={"column"}
      md={3}
      xs={12}
      sx={{
        userSelect: "none",
        "&:hover": {
          boxShadow: "1px 0 30px -28px black",
        },
      }}
      className="rounded-2xl p-3 bg-white"
      item
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
        color={"ActiveCaption"}
        fontWeight={"medium"}
        sx={{
          backgroundcolor: "primary",
          backgroundImage: `linear-gradient(45deg,#56c65b, #b2ef9f)`,
          backgroundSize: "100%",
          backgroundRepeat: "repeat",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {number}
      </Typography>
      {children}
    </Grid>
  );
  return (
    <Grid container gap={2}>
      <Item title="Students" number={100}></Item>
      <Item title="Teachers" number={42}></Item>
      <Item title="Queries" number={10}></Item>
    </Grid>
  );
};

export default Stats;
