"use client";
import CreateStudent from "@/components/Students/CreateStudent";
import {
  Box,
  Button,
  CircularProgress,
  Input,
  Typography,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import React, { useEffect, useRef } from "react";
import GetStudents from "@/components/Students/GetStudents";
import { read, readFile, utils } from "xlsx";
import { getSession } from "next-auth/react";
import ModalLay from "@/components/ModalLay";
import FormWithLoading from "@/components/FormWithLoading";

const Students = () => {
  const [show, setShow] = React.useState(false);
  const [opener, setOpener] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [reload, reloadData] = React.useState(false);
  const [array, setArray] = React.useState([]);
  const inputFile = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reload) {
      setShow(!show);
      reloadData(false);
    }
  }, [reload]);

  const handleOnChange = (e: any) => {
    setLoading(true);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const fd = e.target.result;
        const wb = read(fd, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const options = { header: 1 };
        const data: any = utils.sheet_to_json(ws, options);
        // const header: any = data.shift();
        const customHeaders: any = [];
        await data[0].forEach(async (element: string, index: number) => {
          customHeaders[index] = element
            .trim()
            .split(" ")
            .join("_")
            .toLowerCase();
        });
        data[0] = customHeaders;
        const result = data
          .map((row: any, index: number) => {
            if (index === 0) {
              // Skip header row
              return null;
            }
            const obj: any = {};
            row.forEach((value: any, j: number) => {
              const header = data[0][j];
              obj[header] = value;
            });
            return obj;
          })
          .filter((row: any) => row !== null);
        const session = await getSession();
        try {
          await fetch("/api/students/bulkimport", {
            method: "POST",
            body: JSON.stringify({ data: result }),
            headers: {
              "Content-Type": "application/json",
              authorization: session?.user.accessToken ?? "",
            },
            cache: "no-store",
          });
          setOpener(false);
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  return (
    <Box>
      <Box overflow={"hidden"}>
        <ModalLay
          buttonTitle="Bulk Import Students"
          buttonProps={{
            className: "float-right my-2 ml-2",
            variant: "contained",
            color: "primary",
          }}
          opener={opener}
          setOpener={setOpener}
        >
          <Typography variant="h6" component="h2">
            Bulk Import Students
          </Typography>
          <Typography className="my-2">
            Headings should be like this: First Name, Last Name, Class,
            Username, Password
          </Typography>
          <input
            type="file"
            className="hidden"
            ref={inputFile}
            onChange={handleOnChange}
          />
          <Button
            variant="contained"
            {...(loading && {
              disabled: true,
              startIcon: <CircularProgress size={20} />,
            })}
            onClick={() => inputFile.current?.click()}
          >
            Choose File
          </Button>
        </ModalLay>
        <Button
          variant="contained"
          onClick={() => setShow(!show)}
          color="secondary"
          className="float-right my-2"
        >
          <Add /> Add Student
        </Button>
      </Box>
      {show && <CreateStudent reloadData={reloadData} />}
      <GetStudents reload={reload} />
    </Box>
  );
};

export default Students;
