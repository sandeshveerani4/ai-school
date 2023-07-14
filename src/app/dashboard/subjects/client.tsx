"use client";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { ChangeEvent, useEffect, useState } from "react";
import CreateSubject from "@/components/Subjects/CreateSubject";
import GetSubjects from "@/components/Subjects/GetSubjects";
import { getClasses } from "@/components/Classes/GetClasses";
import { Class } from "@/components/Classes/ClassRow";
import { Section } from "@prisma/client";
import { inputWhite } from "@/components/Students/StudentFields";
import { Teacher } from "@/components/Teachers/TeacherFields";
const Client = ({
  classes,
  teachers,
}: {
  classes: Class[];
  teachers: Teacher[];
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedClass, setSelectedClass] = useState(0);
  const [selectedSection, setSelectedSection] = useState(0);
  const [show, setShow] = React.useState(false);

  const classChanged = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedClass(Number(e.target.value));
    setSections(classes[Number(e.target.value)].sections);
  };

  return (
    <Box>
      <Box overflow={"hidden"}>
        <IconButton onClick={() => setShow(!show)} className="float-right my-2">
          <Add />
        </IconButton>
      </Box>
      {show && <CreateSubject classes={classes} teachers={teachers} />}
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
      <GetSubjects classId={selectedClass} sectionId={selectedSection} />
    </Box>
  );
};

export default Client;
