"use client";
import React from "react";
import { Grid, TextField, TextFieldProps, Button } from "@mui/material";
import { Prisma } from "@prisma/client";
import FormWithLoading from "../FormWithLoading";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
const TeacherFields = ({ data, ...props }: { data: any }) => {
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
  const fields = [
    {
      label: "ID",
      name: "id",
      required: true,
      disabled: true,
      defaultValue: data.id,
    },
    {
      label: "First Name",
      name: "first_name",
      required: true,
      defaultValue: data.profile.first_name,
    },
    {
      label: "Last Name",
      name: "last_name",
      required: true,
      defaultValue: data.profile.last_name,
    },
    {
      label: "Username",
      name: "username",
      required: true,
      defaultValue: data.username,
    },
    { label: "Password", name: "password" },
    {
      label: "Date of Birth",
      name: "date_of_birth",
      defaultValue: data.profile["data_of_birth"],
    },
  ];
  return (
    <FormWithLoading
      endpoint={`/api/teachers/${data["id"]}`}
      submitName="Update Teacher"
      method="PUT"
      buttonProps={{ color: "secondary" }}
    >
      <Grid container rowSpacing={1} columnSpacing={1}>
        {fields.map((item, index) =>
          item.name === "date_of_birth" ? (
            <Grid key={index} item md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  sx={{ background: "white", width: "100%" }}
                  {...item}
                />
              </LocalizationProvider>
            </Grid>
          ) : (
            <FieldComp key={index} {...item} />
          )
        )}
      </Grid>
    </FormWithLoading>
  );
};
export default TeacherFields;
