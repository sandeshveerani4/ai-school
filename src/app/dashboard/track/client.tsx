"use client";
import { Class } from "@/components/Classes/ClassRow";
import AssignmentAnalysis from "@/components/Track/AssignmentAnalysis";
import OverallPerformance from "@/components/Track/OverallPerformance";
import StudentAnalysis from "@/components/Track/StudentAnalysis";
import TestAnalysis, {
  testAnalysisType,
} from "@/components/Track/TestAnalysis";
import { StudentAnalysisType } from "@/lib/srv-funcs";
import { Box, Tab, Tabs } from "@mui/material";
import { Prisma } from "@prisma/client";
import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export type assignmentAnalysisType = Prisma.AssignmentGetPayload<{
  include: {
    _count: { select: { submissions: true } };
    options: true;
    topic: true;
  };
}>;
const Client = ({
  overallTrack,
  classes,
  testAnalysis,
  assignmentAnalysis,
  studentAnalysis,
}: {
  overallTrack: any;
  testAnalysis: testAnalysisType[];
  assignmentAnalysis: assignmentAnalysisType[];
  studentAnalysis: StudentAnalysisType[];
  classes: Class[];
}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Overall Performance" {...a11yProps(0)} />
          <Tab label="Test analysis" {...a11yProps(1)} />
          <Tab label="Assignment analysis" {...a11yProps(2)} />
          <Tab label="Student analysis" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <OverallPerformance {...{ overallTrack, classes }} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TestAnalysis {...{ testAnalysis, classes }} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AssignmentAnalysis {...{ assignmentAnalysis, classes }} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <StudentAnalysis {...{ studentAnalysis, classes }} />
      </TabPanel>
    </>
  );
};

export default Client;
