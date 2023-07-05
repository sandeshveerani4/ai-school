"use client";
import { reqParams } from "@/consts";
import {
  Alert,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
} from "@mui/material";
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
  button = true,
  loadingA = false,
  setLoadingA,
  middleware,
}: {
  data?: any;
  children?: React.ReactNode;
  setDone?: React.Dispatch<React.SetStateAction<boolean>>;
  submitName?: string;
  endpoint: string;
  setData?: React.Dispatch<React.SetStateAction<any>>;
  buttonProps?: ButtonProps;
  method?: string;
  button?: boolean;
  loadingA?: boolean;
  setLoadingA?: React.Dispatch<React.SetStateAction<boolean>>;
  middleware?: any;
}) => {
  const [loading, setLoading] =
    loadingA !== undefined && setLoadingA !== undefined
      ? [loadingA, setLoadingA]
      : React.useState(false);
  const [error, setError] = React.useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    var finalData = {};
    if (middleware) {
      const runned = await middleware();
      if (runned) {
        finalData = { ...runned };
      }
    }
    if (data) {
      finalData = { ...finalData, ...data };
    } else {
      const formData = new FormData(e.target);
      const value = Object.fromEntries(formData.entries());
      finalData = { ...finalData, ...value };
    }
    finalData = JSON.stringify(finalData);
    const options: RequestInit = {
      ...(await reqParams()),
      method: method,
      body: finalData as string,
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
      {button && (
        <Button
          type="submit"
          className="my-2"
          {...(loading && {
            disabled: true,
            startIcon: <CircularProgress size={20} />,
          })}
          variant="outlined"
          {...buttonProps}
        >
          {submitName}
        </Button>
      )}
    </Box>
  );
};

export default FormWithLoading;
