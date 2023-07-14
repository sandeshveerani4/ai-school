"use client";
import React from "react";
import {
  Grid,
  TextField,
  TextFieldProps,
  Select,
  Button,
  SelectChangeEvent,
  MenuItem,
  CardMedia,
} from "@mui/material";
import { Prisma, Section } from "@prisma/client";
import { config } from "@/lib/consts";
import { Class } from "../Classes/ClassRow";
export type Student = Prisma.UserGetPayload<{
  include: {
    student: { include: { class: true; section: true } };
  };
}>;
function IsJson(str: any) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
export const inputProps = {
  sx: {
    textTransform: "capitalize",
  },
};
export const inputWhite = { background: "white" };
const StudentFields = ({
  student,
  classes,
  ...props
}: {
  student: Student;
  classes: Class[];
}) => {
  const [selectedClass, setSelectedClass] = React.useState(0);
  const [sections, setSections] = React.useState<Section[]>([]);
  const classChange = (event: SelectChangeEvent) => {
    setSelectedClass(Number(event.target.value));
  };
  React.useEffect(() => {
    if (selectedClass !== 0) {
      setSections(
        classes.filter((val) => val.id === selectedClass)[0].sections
      );
    }
  }, [classes]);
  const FieldComp = (props: TextFieldProps) => {
    return (
      <Grid item md={6} xs={12}>
        <TextField
          sx={inputWhite}
          InputLabelProps={inputProps}
          {...props}
          fullWidth
        />
      </Grid>
    );
  };
  return (
    <>
      {student.pictureURL && (
        <CardMedia
          component="img"
          className="rounded-lg my-3"
          sx={{
            width: "170px",
          }}
          src={config.site.imageDomain + student.pictureURL}
        />
      )}
      <Grid container rowSpacing={1} columnSpacing={1}>
        <FieldComp label="ID" disabled value={student["id"]} />
        <FieldComp label="Username" value={student["username"]} />
        <FieldComp label="First Name" value={student.first_name} />
        <FieldComp label="Last Name" value={student.last_name} />
        <Grid item md={6} xs={12}>
          <TextField
            select
            label="Class"
            defaultValue={student.student?.classId}
            sx={inputWhite}
            fullWidth
            name="Class"
            required={true}
          >
            {classes.map((item: Class) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Button className="my-2" color="secondary" variant="contained">
        Update
      </Button>
    </>
  );
};
export default StudentFields;
