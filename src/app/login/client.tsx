"use client";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Alert, Container } from "@mui/material";
import { config } from "@/lib/consts";
import { signIn } from "next-auth/react";
import { useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";

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
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
        }}
      >
        <Typography
          component="h1"
          fontWeight={"bold"}
          className="mb-4"
          textAlign={"center"}
          variant="h5"
        >
          {config.site.name}
        </Typography>
        <Grid container justifyContent={"center"}>
          <CssBaseline />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
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
                  label="Username"
                  onChange={(e) => (userName.current = e.currentTarget.value)}
                  required
                  fullWidth
                  autoFocus
                />
                <TextField
                  margin="normal"
                  onChange={(e) => (password.current = e.currentTarget.value)}
                  label="Password"
                  type="password"
                  required
                  fullWidth
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="outlined"
                  {...(loading && {
                    disabled: true,
                    startIcon: <CircularProgress size={20} />,
                  })}
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
