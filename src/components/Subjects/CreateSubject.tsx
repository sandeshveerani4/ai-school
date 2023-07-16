"use client";
import { Box, Grid, MenuItem, Select, TextField } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useState, useEffect } from "react";
import FormWithLoading from "../FormWithLoading";
import { Class } from "../Classes/ClassRow";
import { Section } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Teacher } from "../Teachers/TeacherFields";

const getOptions = (array: any) => {
  return array.map((item: any, index: any) => (
    <MenuItem key={index} value={item.id}>
      {item.name ?? `${item.first_name} ${item.last_name}`}
    </MenuItem>
  ));
};
const CreateSubject = ({
  classes,
  teachers,
}: {
  classes: Class[];
  teachers: Teacher[];
}) => {
  const [selectedClass, setSelectedClass] = React.useState(0);
  const [sections, setSections] = React.useState<Section[]>([]);
  const classChange = (event: SelectChangeEvent) => {
    setSelectedClass(Number(event.target.value));
  };
  const fields = [
    { label: "Subject Name", name: "name", required: true },
    { label: "Subject Teacher", name: "teacher", select: true, required: true },
    {
      label: "Class",
      name: "class",
      required: true,
      select: true,
      onChange: (e: any) => classChange(e),
    },
    { label: "Section", name: "section", select: true, required: true },
  ];
  React.useEffect(() => {
    if (selectedClass !== 0) {
      (async () => {
        setSections(
          classes.filter((val) => val.id === selectedClass)[0].sections
        );
      })();
    }
  }, [selectedClass]);
  const [done, setDone] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (done) {
      router.refresh();
      setDone(false);
    }
  }, [done]);
  return (
    <FormWithLoading
      submitName="Create Subject"
      endpoint="/api/subjects"
      setDone={setDone}
    >
      <Grid container rowSpacing={1} columnSpacing={1}>
        {fields.map((item, index) => (
          <Grid key={index} item md={6} xs={12}>
            <TextField
              sx={{ background: "white" }}
              InputLabelProps={{
                sx: {
                  textTransform: "capitalize",
                },
              }}
              {...item}
              fullWidth
            >
              {item.select &&
                (item.name == "class"
                  ? getOptions(classes)
                  : item.name == "section"
                  ? getOptions(sections)
                  : item.name == "teacher"
                  ? getOptions(teachers)
                  : "")}
            </TextField>
          </Grid>
        ))}
      </Grid>
    </FormWithLoading>
  );
};

export default CreateSubject;
