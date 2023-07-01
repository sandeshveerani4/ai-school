"use client";
import {
  Alert,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
} from "@mui/material";
import { getSession } from "next-auth/react";
import React from "react";

const FormWithLoading = ({
  data,
  children,
  setDone,
  submitName,
  endpoint,
  setData,
  buttonProps,
  method = "POST",
}: {
  data?: any;
  children?: React.ReactNode;
  setDone?: React.Dispatch<React.SetStateAction<boolean>>;
  submitName: string;
  endpoint: string;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  buttonProps?: ButtonProps;
  method?: string;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const session = await getSession();
    if (data) {
      var JSONdata = JSON.stringify(data);
    } else {
      const formData = new FormData(e.target);
      const value = Object.fromEntries(formData.entries());
      var JSONdata = JSON.stringify(value);
    }
    const options: RequestInit = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        authorization: session?.user.accessToken ?? "",
      },
      body: JSONdata,
      cache: "no-store",
    };
    const response = await fetch(endpoint, options);
    try {
      const result = await response.json();
      if (result.error) {
        setError(result.error);
      } else {
        setData && setData(result);
        setDone && setDone(true);
      }
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };
  return (
    <Box component={"form"} onSubmit={handleSubmit}>
      {children}
      {error && (
        <Alert severity="error" className="mt-2">
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        className="my-2"
        {...(loading && {
          disabled: true,
          startIcon: <CircularProgress size={20} />,
        })}
        variant="contained"
        {...buttonProps}
      >
        {submitName}
      </Button>
    </Box>
  );
};

export default FormWithLoading;
