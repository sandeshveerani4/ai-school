"use client";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Alert, InputAdornment } from "@mui/material";
import { config } from "@/lib/consts";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";
interface Props {
  searchParams: SearchParams;
}
interface SearchParams {
  callbackUrl: string;
  error: string;
}
export default function Client(props: Props) {
  const router = useRouter();
  const userName = useRef("");
  const password = useRef("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const results = await signIn("credentials", {
      username: userName.current,
      password: password.current,
      redirect: false,
      callbackUrl: props?.searchParams?.callbackUrl ?? "/dashboard",
    });
    if (!results?.error)
      router.push(props?.searchParams?.callbackUrl ?? "/dashboard");
    setLoading(false);
    if (results?.error) {
      setError(results.error);
    }
  };
  return (
    <Grid
      component="main"
      flexDirection={"column"}
      className="flex"
      justifyContent={"center"}
      alignItems={"center"}
      height="100%"
      width="97%"
      margin="auto"
      py={3}
      spacing={2}
    >
      <Grid
        className="flex"
        direction="column"
        alignItems={"center"}
        justifyContent={"center"}
        flex={1}
        container
        item
      >
        <Typography
          component="h1"
          fontSize={"30px"}
          fontWeight={"bold"}
          className="mb-4"
          textAlign={"center"}
          color={"white"}
          variant="h5"
        >
          {config.site.name}
        </Typography>
        <Grid container justifyContent={"center"}>
          <CssBaseline />
          <Grid
            item
            xs={12}
            sm={6}
            md={5}
            lg={3}
            className="rounded-2xl bg-white border-solid border-[0.5px] border-neutral-200"
          >
            <Box
              sx={{
                m: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box component={"form"} sx={{ mt: 1 }} onSubmit={handleLogin}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                  margin="normal"
                  placeholder="Username"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person2OutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => (userName.current = e.currentTarget.value)}
                  required
                  fullWidth
                  size="small"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => (password.current = e.currentTarget.value)}
                  placeholder="Password"
                  type="password"
                  required
                  size="small"
                  fullWidth
                />

                <Button
                  type="submit"
                  fullWidth
                  {...(loading && {
                    disabled: true,
                    startIcon: <CircularProgress size={20} />,
                  })}
                  sx={{
                    mt: 3,
                    mb: 2,
                    background: "linear-gradient(45deg, #f12711, #f5b119)",
                    color: "white",
                    fontWeight: "700",
                  }}
                >
                  Sign In
                </Button>
              </Box>
              <Button LinkComponent={Link} href={"/forgot-password"}>
                Reset your Password
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography sx={{ color: "#ffffff", opacity: "0.5" }}>
          Copyright 2023 All rights reserved | Digital Barath
        </Typography>
      </Grid>
    </Grid>
  );
}
