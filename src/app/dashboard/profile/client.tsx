"use client";
import { User } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Grid, TextField, Button, CardMedia } from "@mui/material";
import AccountCircle from "@mui/icons-material/PersonOutlineOutlined";
import { inputWhite } from "@/components/Students/StudentFields";
import FormWithLoading from "@/components/FormWithLoading";
import { fileUpload } from "@/lib/file_upload";
import { config } from "@/lib/consts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const Client = ({ userDetails }: { userDetails: User }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any>(undefined);
  const { update } = useSession();
  const router = useRouter();
  const middleware = async () => {
    const fln = (await fileUpload(image)).filename;
    update({ pictureURL: fln });
    return { filename: fln };
  };
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (done) {
      router.refresh();
      setDone(false);
    }
  }, [done]);
  return (
    <FormWithLoading
      endpoint="/api/user"
      middleware={middleware}
      submitName="Save Changes"
      setDone={setDone}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          {userDetails.pictureURL || image ? (
            <Image
              src={
                image
                  ? URL.createObjectURL(image)
                  : config.site.imageDomain + userDetails.pictureURL
              }
              className="rounded-2xl"
              width={200}
              height={200}
              alt="Profile Picture"
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
          color="secondary"
          onClick={(e) => inputRef.current?.click()}
        >
          Upload Image
        </Button>
        <Grid item xs={12}>
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
