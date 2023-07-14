import {
  Box,
  Chip,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Grid,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ModalLay from "../ModalLay";
import FormWithLoading from "../FormWithLoading";
import Add from "@mui/icons-material/Add";
import { Prisma } from "@prisma/client";
import { Teacher } from "../Teachers/TeacherFields";
import { useRouter } from "next/navigation";
export type Class = Prisma.ClassGetPayload<{
  include: {
    sections: { include: { classTeacher: { include: { user: true } } } };
  };
}>;
const ClassRow = ({ data, teachers }: { data: Class; teachers: Teacher[] }) => {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (done) {
      router.refresh();
      setOpen(false);
    }
  }, [done]);
  return (
    <TableRow
      key={data.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell>{data["id"]}</TableCell>
      <TableCell>{data["name"]}</TableCell>
      <TableCell>{data["rank"]}</TableCell>
      <TableCell>
        <Grid container direction={"column"} spacing={1}>
          {data.sections.map((item, index: number) => (
            <Grid item>
              <Chip
                key={index}
                label={
                  item.name +
                  ": " +
                  item.classTeacher.user.first_name +
                  " " +
                  item.classTeacher.user.last_name
                }
                component="a"
                href="#basic-chip"
                variant="outlined"
                clickable
              />
            </Grid>
          ))}
        </Grid>
        <IconButton onClick={() => setOpen(true)}>
          <Add />
        </IconButton>
        <ModalLay isButton={false} opener={open} setOpener={setOpen}>
          <FormWithLoading
            submitName="Create Section"
            endpoint={`/api/classes/${data.id}/sections/`}
            setDone={setDone}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField label="Section Name" name="name" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Class Teacher"
                  name="teacherId"
                  fullWidth
                  select
                >
                  {teachers.map((val) => (
                    <MenuItem key={val.id} value={val.id}>
                      {val.first_name} {val.last_name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </FormWithLoading>
        </ModalLay>
      </TableCell>
    </TableRow>
  );
};

export default ClassRow;
