"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  TextField,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  CardMedia,
} from "@mui/material";
import { inputWhite } from "@/components/Students/StudentFields";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import RefreshIcon from "@mui/icons-material/RefreshOutlined";
import FormWithLoading, { handleType } from "@/components/FormWithLoading";
import { useRouter } from "next/navigation";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { config } from "@/lib/consts";
import AccountCircle from "@mui/icons-material/PersonOutlineOutlined";
dayjs.extend(relativeTime);

export type Message = Prisma.MessagesGetPayload<{
  include: { user: true };
}>;
const Client = ({
  discussionId,
  messages,
}: {
  discussionId: number;
  messages: Message[];
}) => {
  const [loadingA, setLoadingA] = useState(false);
  const [done, setDone] = useState(false);
  const [is_AI, setAI] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();
  const { data: session } = useSession();
  const ref = useRef<handleType>(null);
  useEffect(() => {
    if (done) {
      setValue("");
      router.refresh();
      setDone(false);
    }
  }, [done]);
  const MessageItem = ({ message }: { message: Message }) => {
    const ownership = message.user?.role == session?.user.role;
    const timeL = dayjs(message.createdAt).fromNow();
    const ppic = message.user?.pictureURL;
    return (
      <Grid
        xs={12}
        container
        justifyContent={ownership ? "flex-end" : "flex-start"}
        alignItems={"center"}
        gap={1}
        item
      >
        {!ownership &&
          !message.is_AI &&
          (ppic ? (
            <Grid item>
              <CardMedia
                component={"img"}
                src={config.site.imageDomain + ppic}
                className="rounded-full"
                sx={{ width: "32px", height: "32px" }}
              />
            </Grid>
          ) : (
            <Box
              className="rounded-full bg-neutral-100 flex item-center justify-center"
              sx={{ width: "40px", height: "40px" }}
            >
              <AccountCircle fontSize={"large"} />
            </Box>
          ))}
        <Tooltip title={(ownership ? "Sent " : "Received ") + timeL}>
          <Grid
            item
            className={`${
              ownership
                ? "bg-blue-700 text-white"
                : message.is_AI
                ? "bg-green-500 text-white"
                : "bg-neutral-200"
            } rounded-3xl py-2 px-3`}
          >
            <Typography
              variant="button"
              fontSize={"medium"}
              sx={{ cursor: "default" }}
              maxWidth={"60%"}
            >
              {message.content}
            </Typography>
          </Grid>
        </Tooltip>
      </Grid>
    );
  };
  return (
    <Grid direction={"column"} className="mt-4" gap={3} container>
      <FormWithLoading
        endpoint={`/api/discussions/${discussionId}/messages`}
        button={false}
        data={{ content: value, is_AI: is_AI }}
        {...{ loadingA, setLoadingA }}
        setDone={setDone}
        ref={ref}
      >
        {session && session.user.role === "STUDENT" && (
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={is_AI}
                  onChange={(e) => {
                    setAI(e.target.checked);
                  }}
                />
              }
              label="AI Mode"
              name="is_AI"
            />
          </Grid>
        )}
        <Grid container item spacing={1}>
          <Grid item alignItems={"center"} justifyContent={"center"}>
            <Tooltip title="Refresh Messages">
              <IconButton onClick={() => router.refresh()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Grid>

          <Grid flexGrow={1} item>
            <TextField
              placeholder="Type your Message here"
              fullWidth
              sx={inputWhite}
              name="content"
              size="small"
              value={value}
              multiline
              {...(loadingA && { disabled: true })}
              onChange={(e) => setValue(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  ref.current?.handleSubmit();
                }
              }}
            />
          </Grid>
          <Grid item alignItems={"center"} justifyContent={"center"}>
            <Tooltip title="Send Message">
              <IconButton type="submit">
                {loadingA ? (
                  <CircularProgress size={20} />
                ) : (
                  <SendOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </FormWithLoading>
      <Grid container overflow={"auto"} item gap={1}>
        {session &&
          messages.map((message) => (
            <MessageItem {...{ message }} key={message.id} />
          ))}
      </Grid>
    </Grid>
  );
};

export default Client;
