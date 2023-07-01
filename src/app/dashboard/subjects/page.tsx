"use client";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { ChangeEvent, useEffect, useState } from "react";
import CreateSubject from "@/components/Subjects/CreateSubject";
import GetSubjects from "@/components/Subjects/GetSubjects";
import { getClasses } from "@/components/Classes/GetClasses";
import { Class, getSections } from "@/components/Classes/ClassRow";
import { Section } from "@prisma/client";
import { inputWhite } from "@/components/Students/StudentFields";
const Subjects = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedClass, setSelectedClass] = useState(0);
  const [selectedSection, setSelectedSection] = useState(0);
  useEffect(() => {
    (async () => {
      setClasses(await getClasses());
    })();
  }, []);
  const [show, setShow] = React.useState(false);

  const [reload, reloadData] = React.useState(false);
  const classChanged = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSections(await getSections(e.target.value as unknown as number));
    setSelectedClass(e.target.value as unknown as number);
  };
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
          <Add /> Add Subject
        </Button>
      </Box>
      {show && <CreateSubject reloadData={reloadData} />}
      <Box className="mb-2">
        <TextField
          label="Class"
          sx={{ width: "150px", ...inputWhite }}
          size="small"
          onChange={(e) => classChanged(e)}
          select
        >
          {classes.length !== 0 &&
            classes.map((item, index) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label="Section"
          sx={{ width: "150px", marginLeft: 1, ...inputWhite }}
          onChange={(e) => {
            setSelectedSection(e.target.value as unknown as number);
          }}
          size="small"
          select
        >
          {sections.length !== 0 &&
            sections.map((item, index) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
        </TextField>
      </Box>
      <GetSubjects
        classId={selectedClass}
        sectionId={selectedSection}
        reload={reload}
      />
    </Box>
  );
};

export default Subjects;
