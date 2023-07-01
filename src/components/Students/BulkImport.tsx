import React, { useRef, useState } from "react";
import ModalLay from "../ModalLay";
import { Button, CircularProgress, Typography } from "@mui/material";
import { read, utils } from "xlsx";
import { reqParams } from "@/consts";

const BulkImport = ({
  reloadData,
}: {
  reloadData: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [opener, setOpener] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);

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
        try {
          await fetch("/api/students/bulkimport", {
            method: "POST",
            body: JSON.stringify({ data: result }),
            ...(await reqParams()),
          });
          setOpener(false);
          reloadData(true);
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  return (
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
        Headings should be like this: First Name, Last Name, Class, Section,
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
  );
};

export default BulkImport;
