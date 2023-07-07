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
import { Class, Prisma } from "@prisma/client";
import { getClasses } from "../Classes/GetClasses";
import { getSession } from "next-auth/react";
import { getSections } from "../Classes/ClassRow";
import { config } from "@/lib/consts";
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
const StudentFields = ({ data, ...props }: { data: Student }) => {
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState(0);
  const [sections, setSections] = React.useState([]);
  const classChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value as unknown as number);
  };
  React.useEffect(() => {
    (async () => {
      setClasses(await getClasses());
    })();
  }, []);
  React.useEffect(() => {
    if (selectedClass !== 0) {
      (async () => {
        setSections(await getSections(selectedClass));
      })();
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
      {data.pictureURL && (
        <CardMedia
          component="img"
          className="rounded-lg my-3"
          sx={{
            width: "170px",
          }}
          src={config.site.imageDomain + data.pictureURL}
        />
      )}
      <Grid container rowSpacing={1} columnSpacing={1}>
        <FieldComp label="ID" disabled value={data["id"]} />
        <FieldComp label="Username" value={data["username"]} />
        <FieldComp label="First Name" value={data.first_name} />
        <FieldComp label="Last Name" value={data.last_name} />
        <Grid item md={6} xs={12}>
          <TextField
            select
            label="Class"
            defaultValue={data.student?.classId}
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
