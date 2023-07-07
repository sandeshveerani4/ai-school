import {
  Box,
  Chip,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ModalLay from "../ModalLay";
import FormWithLoading from "../FormWithLoading";
import Add from "@mui/icons-material/Add";
import { Prisma, Section } from "@prisma/client";
import { getSession } from "next-auth/react";
import { reqParams } from "@/consts";
export type Class = Prisma.ClassGetPayload<{
  include: {
    sections: true;
    classTeacher: { include: { user: true } };
  };
}>;
export const getSections = async (classId: number) => {
  const options: RequestInit = await reqParams();
  const res = await fetch(`/api/classes/${classId}/sections`, options);
  return await res.json();
};
const ClassRow = ({ data }: { data: Class }) => {
  const [sections, setSections] = useState(data.sections);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const loadData = async () => {
    setSections(await getSections(data.id));
  };
  useEffect(() => {
    if (done) {
      setOpen(false);
      loadData();
      setDone(false);
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
        {data.classTeacher.user.first_name} {data.classTeacher.user.last_name}
      </TableCell>
      <TableCell>
        {sections.map((item: Section, index: number) => (
          <Chip
            key={index}
            label={item.name}
            component="a"
            href="#basic-chip"
            variant="outlined"
            clickable
          />
        ))}
        <IconButton onClick={() => setOpen(true)}>
          <Add />
        </IconButton>
        <ModalLay isButton={false} opener={open} setOpener={setOpen}>
          <FormWithLoading
            submitName="Create Section"
            endpoint={`/api/classes/${data.id}/sections/`}
            setDone={setDone}
          >
            <TextField label="Section Name" name="name" />
          </FormWithLoading>
        </ModalLay>
      </TableCell>
    </TableRow>
  );
};

export default ClassRow;
