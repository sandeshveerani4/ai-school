"use client";
import { Box, IconButton } from "@mui/material";
import Add from "@mui/icons-material/Add";
import CreateClass from "@/components/Classes/CreateClass";
import GetClasses from "@/components/Classes/GetClasses";
import React, { useEffect } from "react";

const Classes = () => {
  const [show, setShow] = React.useState(false);
  const [reload, reloadData] = React.useState(false);
  useEffect(() => {
    if (reload) {
      setShow(!show);
      reloadData(false);
    }
  }, [reload]);
  return (
    <Box>
      <Box overflow={"hidden"}>
        <IconButton onClick={() => setShow(!show)} className="float-right my-2">
          <Add />
        </IconButton>
      </Box>
      {show && <CreateClass reloadData={reloadData} />}
      <GetClasses reload={reload} />
    </Box>
  );
};

export default Classes;
