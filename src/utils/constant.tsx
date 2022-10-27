import DashboardIcon from "@mui/icons-material/Dashboard";


import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

export const drawerItem = [{ link: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> }];

export const drawerSettings = [
  { link: "/", name: "Home", icon: <HomeIcon /> },
  { link: "/settings", name: "Settings", icon: <SettingsIcon /> },
  { link: "/profile", name: "Profile", icon: <PersonIcon /> },
];
