import React from "react";
import Client from "./client";
import {
  getAssignmentAnalysis,
  getClasses,
  getOverrallTrack,
  getTestAnalysis,
} from "@/lib/srv-funcs";

const Track = async () => {
  const overallTrack = await getOverrallTrack();
  const classes = await getClasses();
  const testAnalysis = await getTestAnalysis();
  const assignmentAnalysis = await getAssignmentAnalysis();
  return (
    <Client {...{ overallTrack, classes, testAnalysis, assignmentAnalysis }} />
  );
};

export default Track;
