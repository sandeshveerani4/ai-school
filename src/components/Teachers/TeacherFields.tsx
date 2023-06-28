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
export type Teacher = Prisma.UserGetPayload<{
  include: {
    teacher: true;
    profile: true;
  };
}>;
export const inputProps = {
  sx: {
    textTransform: "capitalize",
  },
};
export const inputWhite = { background: "white" };
const TeacherFields = ({ data, ...props }: { data: Teacher }) => {
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
      </Grid>
      <Button className="my-2" color="secondary" variant="contained">
        Update
      </Button>
    </>
  );
};
export default TeacherFields;
