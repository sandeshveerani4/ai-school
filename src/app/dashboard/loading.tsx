"use client";
import { CircularProgress, Skeleton } from "@mui/material";

export default function Loading({ size = 30 }: { size?: number }) {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex justify-center items-center text-center w-100 p-3">
      <CircularProgress size={size} />
    </div>
  );
}
