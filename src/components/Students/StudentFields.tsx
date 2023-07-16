"use client";
import React, { useEffect } from "react";
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
import FormWithLoading from "../FormWithLoading";
import { useRouter } from "next/navigation";
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
  const classChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedClass(Number(event.target.value));
  };
  React.useEffect(() => {
    setSelectedClass(student.student?.classId ?? 0);
  }, []);
  React.useEffect(() => {
    if (selectedClass !== 0) {
      setSections(
        classes.filter((val) => val.id === selectedClass)[0]?.sections ?? []
      );
    }
  }, [selectedClass]);
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
  const [done, setDone] = React.useState(false);
  const router = useRouter();
  useEffect(() => {
    if (done) {
      router.refresh();
      setDone(false);
    }
  }, [done]);
  return (
    <FormWithLoading
      endpoint={`/api/students/${student.id}`}
      submitName="Update"
      method="PATCH"
      setDone={setDone}
    >
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
        <FieldComp
          label="Username"
          name="username"
          defaultValue={student["username"]}
        />
        <FieldComp
          label="First Name"
          name="first_name"
          defaultValue={student.first_name}
        />
        <FieldComp
          label="Last Name"
          name="last_name"
          defaultValue={student.last_name}
        />
        <Grid item md={6} xs={12}>
          <TextField
            select
            label="Class"
            sx={inputWhite}
            fullWidth
            name="classId"
            required={true}
            onChange={(e) => classChange(e)}
            defaultValue={student.student?.classId}
          >
            {classes.map((item: Class) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            select
            label="Section"
            sx={inputWhite}
            fullWidth
            name="sectionId"
            required={true}
            defaultValue={student.student?.sectionId}
          >
            {sections.map((item: Section) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </FormWithLoading>
  );
};
export default StudentFields;
