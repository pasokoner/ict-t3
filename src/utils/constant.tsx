import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

export const drawerItem = [
  { link: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> },
  { link: "/statistics", name: "Statistics", icon: <BarChartIcon /> },
];

export const drawerSettings = [
  { link: "/settings", name: "Settings", icon: <SettingsIcon /> },
  { link: "/profile", name: "Profile", icon: <PersonIcon /> },
];
