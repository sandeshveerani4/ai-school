"use client";
import React from "react";
import { Grid, TextField, TextFieldProps, Button } from "@mui/material";
import { Prisma } from "@prisma/client";
import FormWithLoading from "../FormWithLoading";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { inputProps, inputWhite } from "../Students/StudentFields";
export type Teacher = Prisma.UserGetPayload<{
  include: {
    teacher: true;
  };
}>;

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
      defaultValue: data.first_name,
    },
    {
      label: "Last Name",
      name: "last_name",
      required: true,
      defaultValue: data.last_name,
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
      defaultValue: data["data_of_birth"],
    },
  ];
  return (
    <FormWithLoading
      endpoint={`/api/teachers/${data["id"]}`}
      submitName="Update Teacher"
      method="PATCH"
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
