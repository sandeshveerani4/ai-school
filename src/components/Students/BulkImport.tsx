import React, { useRef, useState } from "react";
import ModalLay from "../ModalLay";
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { read, utils } from "xlsx";
import { reqParams } from "@/lib/consts";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useRouter } from "next/navigation";
const BulkImport = ({
  endpoint,
  subText,
  middleware,
  children,
}: {
  endpoint: string;
  subText: string;
  children?: React.ReactNode;
  middleware?: any;
}) => {
  const router = useRouter();
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
          var finalData = {};
          if (middleware) {
            const runned = await middleware();
            if (runned) {
              finalData = { ...runned };
            }
          }
          finalData = { ...finalData, data: result };
          await fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(finalData),
            ...(await reqParams()),
          });
          setOpener(false);
          router.refresh();
        } catch (e) {
          console.error(e);
        }
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  return (
    <>
      <IconButton onClick={() => setOpener(true)} className="float-right my-2">
        <InsertDriveFileIcon />
      </IconButton>
      <ModalLay isButton={false} opener={opener} setOpener={setOpener}>
        <Typography variant="h6" component="h2">
          Bulk Import
        </Typography>
        {children}
        <Typography className="my-2">{subText}</Typography>
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
    </>
  );
};

export default BulkImport;
