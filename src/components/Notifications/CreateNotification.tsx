import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  Typography,
  MenuItem,
  Checkbox,
} from "@mui/material";
import FormWithLoading from "../FormWithLoading";
import { inputProps, inputWhite } from "../Students/StudentFields";
import { Class } from "../Classes/ClassRow";
import { Section } from "@prisma/client";
import { useRouter } from "next/navigation";
const CreateNotification = ({
  classes,
  setOpen,
}: {
  classes: Class[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [students, setStudents] = useState(false);
  const [selectedClass, setSelectedClass] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  useEffect(() => {
    if (selectedClass) {
      setSections(
        classes.filter((val) => val.id === selectedClass)[0].sections
      );
    }
  }, [selectedClass]);
  const [done, setDone] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (done) {
      router.refresh();
      setOpen(false);
    }
  }, [done]);
  return (
    <FormWithLoading
      endpoint="/api/notifications/"
      submitName="Push Notification"
      setDone={setDone}
    >
      <Grid container spacing={1}>
        <Grid item lg={6} xs={12}>
          <TextField
            required
            label="Title"
            name="title"
            sx={inputWhite}
            fullWidth
          />
        </Grid>
        <Grid
          container
          alignItems={"center"}
          item
          lg={6}
          gap={1}
          direction={"row"}
          xs={12}
        >
          <Typography>To:</Typography>
          <Box>
            <FormControlLabel
              control={<Checkbox size="small" />}
              name="students"
              label="Students"
              onChange={(e) => {
                setStudents((e.currentTarget as HTMLInputElement).checked);
              }}
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              name="teachers"
              label="Teachers"
            />
          </Box>
        </Grid>
        {students && (
          <Grid item xs={12}>
            <TextField
              name="classId"
              label="Class"
              inputProps={inputProps}
              sx={inputWhite}
              fullWidth
              select
              required
              onChange={(e) => setSelectedClass(Number(e.target.value))}
              defaultValue={0}
            >
              <MenuItem value={0}>All</MenuItem>
              {classes.map((val) => (
                <MenuItem
                  key={val.id}
                  value={val.id}
                  {...(val.id === selectedClass && { selected: true })}
                >
                  {val.name}
                </MenuItem>
              ))}
            </TextField>
            {selectedClass !== 0 && (
              <TextField
                name="sectionId"
                label="Section"
                inputProps={inputProps}
                sx={inputWhite}
                required
                fullWidth
                select
              >
                {sections.map((val) => (
                  <MenuItem key={val.id} value={val.id}>
                    {val.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField label="Link" name="link" sx={inputWhite} fullWidth />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="content"
            label="Message"
            sx={inputWhite}
            multiline
            required
            minRows={4}
            fullWidth
          />
        </Grid>
      </Grid>
    </FormWithLoading>
  );
};

export default CreateNotification;
