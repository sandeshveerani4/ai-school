"use client";
import AssignmentAnalysis from "@/components/Track/AssignmentAnalysis";
import OverallPerformance from "@/components/Track/OverallPerformance";
import StudentAnalysis from "@/components/Track/StudentAnalysis";
import TestAnalysis from "@/components/Track/TestAnalysis";
import { Box, Tab, Tabs } from "@mui/material";
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
const Client = () => {
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
        <OverallPerformance />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TestAnalysis />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <AssignmentAnalysis />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <StudentAnalysis />
      </TabPanel>
    </>
  );
};

export default Client;
