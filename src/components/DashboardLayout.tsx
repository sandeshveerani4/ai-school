"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Dashboard from "@mui/icons-material/SpaceDashboardOutlined";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import Question from "@mui/icons-material/TextSnippetOutlined";
import LibraryBooks from "@mui/icons-material/ImportContactsOutlined";
import PersonIcon from "@mui/icons-material/PeopleOutlined";
import Forum from "@mui/icons-material/ChatOutlined";
import AssignmentIcon from "@mui/icons-material/AssignmentOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import ClassIcon from "@mui/icons-material/ClassOutlined";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { signOut } from "next-auth/react";
import { config } from "@/lib/consts";
import Loading from "@/app/dashboard/loading";
import ExitToApp from "@mui/icons-material/ExitToApp";
import {
  Stack,
  MenuItem,
  IconButton,
  Zoom,
  Grid,
  Tooltip,
  Chip,
  CardMedia,
} from "@mui/material";
import InsightsIcon from "@mui/icons-material/AnalyticsOutlined";
import AccountCircle from "@mui/icons-material/PersonOutlineOutlined";
import FlashOnOutlinedIcon from "@mui/icons-material/FlashOnOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { Session } from "next-auth";
import Image from "next/image";
export const metadata: Metadata = {
  title: "Dashboard",
};
const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
  window?: () => Window;
  unread: { unread: number; xp?: number };
  session: Session | null;
}
interface MenuItem {
  id: number;
  name: string | JSX.Element;
  path: string;
  roles: any;
  icon?: JSX.Element;
}
const menuItems = (unread: number): MenuItem[] => {
  return [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: <Dashboard />,
      roles: ["ADMIN", "TEACHER", "STUDENT"],
    },
    {
      id: 2,
      name: "Students",
      path: "/dashboard/students",
      icon: <PersonIcon />,
      roles: ["ADMIN"],
    },
    {
      id: 3,
      name: "Assignments",
      path: "/dashboard/assignments",
      icon: <AssignmentIcon />,
      roles: ["ADMIN", "TEACHER", "STUDENT"],
    },
    {
      id: 10,
      name: (
        <>
          Practise{" "}
          <Chip label="New ✨" variant="filled" size="small" color="primary" />
        </>
      ),
      path: "/dashboard/practise",
      roles: ["STUDENT"],
      icon: <FlashOnOutlinedIcon />,
    },
    {
      id: 4,
      name: "Teachers",
      path: "/dashboard/teachers",
      icon: <GroupsIcon />,
      roles: ["ADMIN"],
    },
    {
      id: 5,
      name: "Classes",
      path: "/dashboard/classes",
      icon: <ClassIcon />,
      roles: ["ADMIN"],
    },
    {
      id: 6,
      name: "Subjects",
      path: "/dashboard/subjects",
      icon: <LibraryBooks />,
      roles: ["ADMIN"],
    },
    {
      id: 7,
      name: "Discussions",
      path: "/dashboard/discussions",
      icon: <Forum />,
      roles: ["ADMIN", "TEACHER", "STUDENT"],
    },
    {
      id: 8,
      name: "Track",
      path: "/dashboard/track",
      icon: <InsightsIcon />,
      roles: ["ADMIN", "TEACHER"],
    },
    {
      id: 9,
      name: "Questions",
      path: "/dashboard/questions",
      icon: <Question />,
      roles: ["ADMIN", "TEACHER"],
    },
    {
      id: 11,
      name: (
        <>
          Notifications{" "}
          {unread !== 0 && <Chip label={unread} color="error" size="small" />}
        </>
      ),
      path: "/dashboard/notifications",
      icon: <NotificationsOutlinedIcon />,
      roles: ["ADMIN", "TEACHER", "STUDENT"],
    },
  ];
};
const getValueFromPath = (path: string) => {
  const match = path.split("/");
  return match.length > 2 ? match[2] : match[1];
};
const DashboardLayout = (props: Props) => {
  const currentPage = usePathname();
  const { window, children, unread, session } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const buttonSx = {
    justifyContent: "left",
    alignItems: "center",
    gap: 1,
    marginInline: 1,
    marginBlock: 0.5,
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const NavBarItem = ({ item, index }: { item: MenuItem; index: number }) => (
    <ListItem disablePadding>
      {currentPage === item.path.toLowerCase() && (
        <Zoom in={true} style={{ transitionDelay: `0.5s` }}>
          <Box
            className="rounded-2xl ml-2"
            sx={{ width: "4.3px", height: "30px", bgcolor: "secondary.main" }}
          ></Box>
        </Zoom>
      )}
      <Button
        key={item.id}
        variant="text"
        href={item.path}
        LinkComponent={Link}
        sx={buttonSx}
        size="large"
        color={currentPage === item.path.toLowerCase() ? "secondary" : "light"}
        fullWidth
      >
        {item.icon}
        {item.name}
      </Button>
    </ListItem>
  );
  const drawer = (
    <Stack direction="column" justifyContent={"center"} height={"100%"}>
      <Toolbar variant="dense" className="py-5 items-center justify-center">
        <Typography
          variant="h5"
          textAlign={"center"}
          fontWeight={"medium"}
          color={"primary.main"}
        >
          {config.site.name}
        </Typography>
      </Toolbar>
      <Box
        overflow={"auto"}
        sx={{
          "&::-webkit-scrollbar": {
            width: 6,
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 1,
            backgroundColor: "rgba(0,0,0,.1)",
          },
        }}
        flexGrow={1}
      >
        <List>
          {menuItems(unread.unread).map((item: MenuItem, index: number) => {
            return item.roles.includes(session?.user.role) ? (
              <NavBarItem {...{ item, index }} key={index} />
            ) : (
              ""
            );
          })}
        </List>
      </Box>
      <List>
        {unread.xp !== undefined && (
          <ListItem
            sx={{
              width: "90%",
              background: "linear-gradient(45deg, #f12711, #f5b119)",
              margin: "auto",
            }}
            className="rounded-lg text-white"
          >
            <Grid container>
              <Grid item flex={1}>
                <Typography fontWeight={700} fontStyle={"italic"}>
                  XP:
                </Typography>
              </Grid>
              <Grid item>
                <Typography fontWeight={700}>{unread.xp}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        )}
        <ListItem>
          <Grid
            container
            alignItems={"center"}
            justifyContent={"center"}
            direction={"row"}
          >
            <Grid container alignItems={"center"} item xs={10}>
              <Tooltip title="View Profile">
                <Button
                  LinkComponent={Link}
                  href="/dashboard/profile"
                  startIcon={
                    session?.user.pictureURL ? (
                      <Image
                        src={config.site.imageDomain + session?.user.pictureURL}
                        className="rounded-full bg-neutral-100"
                        width={20}
                        height={20}
                        alt="Profile Picture"
                      />
                    ) : (
                      <AccountCircle />
                    )
                  }
                  sx={{ justifyContent: "left", alignItems: "center" }}
                  fullWidth
                >
                  {session?.user.first_name} {session?.user.last_name}
                </Button>
              </Tooltip>
            </Grid>
            <Grid container alignItems={"center"} item xs={2}>
              <Tooltip title="Logout">
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => signOut()}
                >
                  <ExitToApp />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </ListItem>
      </List>
    </Stack>
  );
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const [title, setTitle] = React.useState("Dashboard");
  React.useEffect(() => {
    const res = getValueFromPath(currentPage);
    if (res === "dashboard") {
      setTitle(
        "Welcome, " + session?.user.first_name + " " + session?.user.last_name
      );
    } else {
      setTitle(res);
    }
  }, [currentPage]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="transparent"
        className="bg-slate-50"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: "unset!important",
        }}
      >
        <Toolbar variant="dense" className="py-5">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            component="h5"
            className="flex-grow"
            color={"black"}
            noWrap
            fontWeight={600}
            textTransform={"capitalize"}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "1px 0 25px -30px black",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "1px 0 25px -30px black",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 3,
          px: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar variant="dense" className="py-5 mb-2" />
        <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
      </Box>
    </Box>
  );
};
export default DashboardLayout;
