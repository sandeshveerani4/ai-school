"use client";
import { CircularProgress, Skeleton } from "@mui/material";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex justify-center items-center text-center w-100 p-3">
      <CircularProgress size={30} />
    </div>
  );
}
