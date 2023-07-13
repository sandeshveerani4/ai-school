import { NotificationMessage } from "@/app/dashboard/notifications/client";
import {
  Box,
  Grid,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AccountCircle from "@mui/icons-material/PersonOutlineOutlined";
import { config, reqParams } from "@/lib/consts";
import EyeIcon from "@mui/icons-material/VisibilityOutlined";
import ModalLay from "../ModalLay";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LinkIcon from "@mui/icons-material/Link";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
dayjs.extend(relativeTime);
const NotificationItem = ({
  val,
  session,
  router,
}: {
  val: NotificationMessage;
  session: Session;
  router: AppRouterInstance;
}) => {
  const [opener, setOpener] = useState(false);
  const timeL = dayjs(val.updatedAt).fromNow();
  const handleOpen = async () => {
    if (session.user.role !== "ADMIN" && !val.notifications[0].read) {
      const options: RequestInit = await reqParams();
      console.log("reached there");
      await fetch(
        `${config.site.url}/api/notifications/${val.notifications[0].id}/read`,
        { ...options, method: "POST" }
      );
      router.refresh();
    }
  };
  return (
    <Grid
      container
      className={`bg-white p-3 rounded-2xl shadow transition ease-in-out delay-800 ${
        session &&
        session.user.role !== "ADMIN" &&
        val.notifications[0].read &&
        "opacity-60 hover:opacity-100"
      }`}
      alignItems={"center"}
      justifyContent={"center"}
      gap={1}
    >
      <Grid item>
        {val.author.pictureURL ? (
          <CardMedia
            component={"img"}
            src={config.site.imageDomain + val.author.pictureURL}
            className="rounded-full"
            sx={{ width: "32px", height: "32px" }}
          />
        ) : (
          <Box
            className="rounded-full bg-neutral-100 flex item-center justify-center"
            sx={{ width: "40px", height: "40px" }}
          >
            <AccountCircle fontSize={"large"} />
          </Box>
        )}
      </Grid>
      <Grid item flex={1}>
        <Typography fontWeight={600} fontSize={"medium"}>
          {val.title}
        </Typography>
        <Typography fontStyle={"italic"} fontSize={"small"} color="CaptionText">
          {timeL} By {val.author.first_name} {val.author.last_name}
        </Typography>
        {Number(session.user.id) === val.authorId && (
          <>
            <Typography fontSize={"small"} color={"CaptionText"}>
              Views: {val._count.notifications} users
            </Typography>
          </>
        )}
      </Grid>
      <Grid className="items-center justify-center flex" item>
        <Tooltip title="View">
          <IconButton
            onClick={() => {
              setOpener(true);
              handleOpen();
            }}
          >
            <EyeIcon />
          </IconButton>
        </Tooltip>
        {val.link && (
          <Tooltip title="Open Link">
            <IconButton LinkComponent={Link} href={val.link} target="_blank">
              <LinkIcon />
            </IconButton>
          </Tooltip>
        )}
        <ModalLay isButton={false} opener={opener} setOpener={setOpener}>
          <Typography fontWeight={600} fontSize={"large"}>
            {val.title}
          </Typography>
          <Typography
            fontStyle={"italic"}
            fontSize={"small"}
            color="CaptionText"
          >
            {timeL} By {val.author.first_name} {val.author.last_name}
          </Typography>
          <Typography>{val.content}</Typography>
          {val.link && (
            <Button
              LinkComponent={Link}
              href={val.link}
              target="_blank"
              startIcon={<LinkIcon />}
            >
              Open Link
            </Button>
          )}
        </ModalLay>
        {Number(session.user.id) === val.authorId && (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Grid>
    </Grid>
  );
};
const GetNotifications = ({
  notifications,
}: {
  notifications: NotificationMessage[];
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <Box>
      <Grid container gap={1}>
        {session &&
          notifications.map((val) => (
            <NotificationItem
              val={val}
              key={val.id}
              router={router}
              session={session}
            />
          ))}
      </Grid>
    </Box>
  );
};

export default GetNotifications;
