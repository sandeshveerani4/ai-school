"use client";
import {
  Box,
  CardMedia,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useEffect } from "react";
import { getClasses } from "../Classes/GetClasses";
import { DateField, DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FormWithLoading from "../FormWithLoading";
import { getSections } from "../Classes/ClassRow";
import { useDropzone } from "react-dropzone";
import ImageIcon from "@mui/icons-material/Image";
import { fileUpload } from "@/lib/file_upload";
import { useRouter } from "next/navigation";

const getOptions = (array: any) => {
  return array.map((item: any, index: any) => (
    <MenuItem key={index} value={item.id}>
      {item.name}
    </MenuItem>
  ));
};
const CreateStudent = () => {
  const [classes, setClasses] = React.useState([]);
  const [selectedClass, setSelectedClass] = React.useState(0);
  const [sections, setSections] = React.useState([]);
  const [image, setImage] = React.useState<any>(undefined);
  const [done, setDone] = React.useState(false);
  const classChange = (event: SelectChangeEvent) => {
    setSelectedClass(event.target.value as unknown as number);
  };
  const fields = [
    { label: "First Name", name: "first_name", required: true },
    { label: "Last Name", name: "last_name", required: true },
    { label: "Username", name: "username", required: true },
    { label: "Password", name: "password", required: true, type: "password" },
    {
      label: "Class",
      name: "class",
      required: true,
      select: true,
      onChange: (e: any) => classChange(e),
    },
    { label: "Section", name: "section", select: true, required: true },
    { label: "Date of Birth", name: "date_of_birth", required: true },
  ];
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
  }, [selectedClass]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
  });
  const middleware = async () => {
    try {
      return await fileUpload(image);
    } catch {}
  };
  const router = useRouter();
  useEffect(() => {
    if (done) router.refresh();
  }, [done]);
  return (
    <>
      <Box
        width={"150px"}
        {...(image === undefined && { height: "150px" })}
        className="p-2 flex flex-col items-center justify-center bg-white rounded-lg"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {image === undefined ? (
          <>
            <ImageIcon fontSize={"large"} />
            <Typography textAlign={"center"} sx={{ userSelect: "none" }}>
              Choose Image
            </Typography>
          </>
        ) : (
          <CardMedia
            component="img"
            sx={{
              width: "100%",
            }}
            src={URL.createObjectURL(image)}
          />
        )}
      </Box>
      <FormWithLoading
        submitName="Create Student"
        endpoint="/api/students"
        setDone={setDone}
        middleware={middleware}
      >
        <Grid container rowSpacing={1} columnSpacing={1}>
          {fields.map((item, index) =>
            item.name === "date_of_birth" ? (
              <Grid key={index} item md={6} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateField
                    sx={{ background: "white", width: "100%" }}
                    {...item}
                  />
                </LocalizationProvider>
              </Grid>
            ) : (
              <Grid key={index} item md={6} xs={12}>
                <TextField
                  sx={{ background: "white" }}
                  InputLabelProps={{
                    sx: {
                      textTransform: "capitalize",
                    },
                  }}
                  {...item}
                  fullWidth
                >
                  {item.select &&
                    (item.name == "class"
                      ? getOptions(classes)
                      : item.name == "section"
                      ? getOptions(sections)
                      : "")}
                </TextField>
              </Grid>
            )
          )}
        </Grid>
      </FormWithLoading>
    </>
  );
};

export default CreateStudent;
