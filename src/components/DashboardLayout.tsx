"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dashboard from "@mui/icons-material/Dashboard";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import Question from "@mui/icons-material/QuestionMark";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupsIcon from "@mui/icons-material/Groups";
import ClassIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { signOut, useSession } from "next-auth/react";
import { config } from "@/consts";
import Loading from "@/app/dashboard/loading";

export const metadata: Metadata = {
  title: "Dashboard",
};
const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
  window?: () => Window;
}
interface MenuItem {
  id: number;
  name: string;
  path: string;
  roles: any;
  icon?: JSX.Element;
}
const menuItems: MenuItem[] = [
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
    roles: ["ADMIN", "TEACHER", "STUDENTS"],
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
    roles: ["ADMIN", "TEACHER"],
  },
  {
    id: 6,
    name: "Questions",
    path: "/dashboard/questions",
    icon: <Question />,
    roles: ["ADMIN","TEACHER"],
  },
];
const getValueFromPath = (path: string) => {
  const match = path.split("/");
  return match.length > 2 ? match[2] : match[1];
};
const DashboardLayout = (props: Props) => {
  const { data: session, status, update } = useSession();

  React.useEffect(() => {
    const interval = setInterval(() => update(), 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, [update]);

  const currentPage = usePathname();

  const { window, children } = props;
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
  const NavBarItem = (item: MenuItem) => (
    <ListItem key={item.id} disablePadding>
      <Button
        key={item.id}
        variant={currentPage == item.path.toLowerCase() ? "contained" : "text"}
        href={item.path}
        LinkComponent={Link}
        sx={buttonSx}
        size="large"
        color={currentPage == item.path.toLowerCase() ? "secondary" : "light"}
        fullWidth
      >
        {item.icon}
        {item.name}
      </Button>
    </ListItem>
  );
  const drawer = (
    <div>
      <Toolbar className="py-5 items-center justify-center">
        <Typography variant="h5" textAlign={"center"}>
          {config.site.name}
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item: MenuItem) => NavBarItem(item))}
        <ListItem disablePadding>
          <Button
            variant="text"
            size="large"
            color="light"
            sx={buttonSx}
            onClick={() => signOut()}
            fullWidth
          >
            <LogoutIcon />
            Log Out
          </Button>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        color="transparent"
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar className="py-5">
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
            variant="h4"
            component="h4"
            noWrap
            fontWeight={700}
            textTransform={"capitalize"}
          >
            {getValueFromPath(currentPage)}
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
        <Toolbar />
        <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
      </Box>
    </Box>
  );
};
export default DashboardLayout;
