import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";

import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RemoveIcon from "@mui/icons-material/Remove";

export const drawerItem = [
  { link: "/dashboard", name: "Dashboard", icon: <DashboardIcon />, },
  { link: "/statistics", name: "Statistics", icon: <BarChartIcon />,  },
];

export const drawerSettings = [
  { link: "/", name: "Home", icon: <HomeIcon /> },
  { link: "/settings", name: "Settings", icon: <SettingsIcon /> },
  { link: "/profile", name: "Profile", icon: <PersonIcon /> },
];

export const statusSectionItems = [
  { count: 10, icon: <InventoryIcon />, title: "Iventory total", color: "success.main" },
  { count: 10, icon: <BuildIcon />, title: "Need repair", color: "warning.main" },
  { count: 10, icon: <PendingActionsIcon />, title: "To condemn", color: "info.main" },
  { count: 10, icon: <RemoveIcon />, title: "Condemned", color: "error.main" },
];
