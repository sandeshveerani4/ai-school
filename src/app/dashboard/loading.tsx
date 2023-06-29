"use client";
import { Skeleton } from "@mui/material";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="align-center w-100 p-2">
      <Skeleton variant="text" animation={"wave"} />
      <Skeleton variant="text" animation={"wave"} />
      <Skeleton variant="text" animation={"wave"} />
    </div>
  );
}
