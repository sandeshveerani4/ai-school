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
} from "@mui/material";
import { Class, Prisma } from "@prisma/client";
import { getClasses, getSections } from "../Classes/GetClasses";
import { getSession } from "next-auth/react";
export type Student = Prisma.UserGetPayload<{
  include: {
    student: { include: { class: true } };
    profile: true;
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
const StudentFields = ({ data, ...props }: { data: any  }) => {
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState(0);
  const [sections, setSections] = React.useState([]);
  const classChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value as unknown as number);
  };
  React.useEffect(() => {
    (async () => {
      const session = await getSession();
      if (session) {
        setClasses(await getClasses(session.user.accessToken));
      }
    })();
  }, []);
  React.useEffect(() => {
    if (selectedClass !== 0) {
      (async () => {
        const session = await getSession();
        if (session) {
          setSections(
            await getSections(session.user.accessToken, selectedClass)
          );
        }
      })();
    }
  }, [classes]);
  const FieldComp = (props: TextFieldProps) => {
    return (
      <Grid item md={6}>
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
      <Grid container rowSpacing={1} columnSpacing={1}>
        <FieldComp label="ID" disabled value={data["id"]} />
        <FieldComp label="Username" value={data["username"]} />
        <FieldComp label="First Name" value={data.profile?.first_name} />
        <FieldComp label="Last Name" value={data.profile?.first_name} />
        <Grid item md={6}>
          <Select
            placeholder="Class"
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
          </Select>
        </Grid>
      </Grid>
      <Button className="my-2" color="secondary" variant="contained">
        Update
      </Button>
    </>
  );
};
export default StudentFields;
