"use client";
import { User } from "@prisma/client";
import React, { useRef, useState } from "react";
import { Box, Grid, TextField, Button, CardMedia } from "@mui/material";
import AccountCircle from "@mui/icons-material/PersonOutlineOutlined";
import { inputWhite } from "@/components/Students/StudentFields";
import FormWithLoading from "@/components/FormWithLoading";
import { fileUpload } from "@/lib/file_upload";
import { config } from "@/lib/consts";
const Client = ({ userDetails }: { userDetails: User }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any>(undefined);
  const middleware = async () => {
    return { filename: (await fileUpload(image)).filename };
  };
  return (
    <FormWithLoading
      endpoint="/api/user"
      middleware={middleware}
      submitName="Save Changes"
    >
      <Grid container spacing={1}>
        <Grid item md={12}>
          {userDetails.pictureURL || image ? (
            <CardMedia
              component={"img"}
              src={
                userDetails.pictureURL
                  ? config.site.imageDomain + userDetails.pictureURL
                  : URL.createObjectURL(image)
              }
              className="rounded-2xl"
              sx={{ width: "200px", height: "200px" }}
            />
          ) : (
            <AccountCircle sx={{ fontSize: "100px" }} />
          )}
          <input
            type="file"
            ref={inputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => e.target.files && setImage(e.target.files[0])}
          />
        </Grid>
        <Button
          className="my-2"
          variant="contained"
          color="secondary"
          onClick={(e) => inputRef.current?.click()}
        >
          Upload Image
        </Button>
        <Grid item md={12}>
          <TextField
            name="password"
            label="Change Password"
            type="password"
            sx={inputWhite}
            size="small"
          />
        </Grid>
      </Grid>
    </FormWithLoading>
  );
};

export default Client;
