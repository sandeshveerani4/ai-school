"use client";
import { Box, Button } from "@mui/material";
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
        <Button
          variant="contained"
          onClick={() => setShow(!show)}
          color="secondary"
          className="float-right my-2"
        >
          <Add /> Create Class
        </Button>
      </Box>
      {show && <CreateClass reloadData={reloadData} />}
      <GetClasses reload={reload} />
    </Box>
  );
};

export default Classes;
