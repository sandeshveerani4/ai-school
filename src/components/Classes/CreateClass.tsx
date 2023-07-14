"use client";
import { Grid, MenuItem, TextField, Box, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import FormWithLoading from "../FormWithLoading";
import { useRouter } from "next/navigation";
import Add from "@mui/icons-material/Add";
const fields = [
  { label: "Class Name", name: "name", required: true },
  { label: "Rank", name: "rank", type: "number", required: true },
];
const CreateClass = () => {
  const [done, setDone] = useState(false);
  const router = useRouter();
  const [show, setShow] = React.useState(false);
  useEffect(() => {
    if (done) router.refresh();
  }, [done]);
  return (
    <>
      <Box overflow={"hidden"}>
        <IconButton onClick={() => setShow(!show)} className="float-right my-2">
          <Add />
        </IconButton>
      </Box>
      {show && (
        <FormWithLoading
          submitName="Create Class"
          endpoint="/api/classes"
          setDone={setDone}
        >
          <Grid container rowSpacing={1} columnSpacing={1}>
            {fields.map((value, index) => (
              <Grid key={index} item md={6}>
                <TextField
                  sx={{ background: "white" }}
                  InputLabelProps={{
                    sx: {
                      textTransform: "capitalize",
                    },
                  }}
                  {...value}
                  fullWidth
                ></TextField>
              </Grid>
            ))}
          </Grid>
        </FormWithLoading>
      )}
    </>
  );
};

export default CreateClass;
