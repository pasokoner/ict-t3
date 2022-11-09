import DashboardIcon from "@mui/icons-material/Dashboard";

// import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

export const drawerItem = [{ link: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> }];

export const drawerSettings = [
  // { link: "/", name: "Home", icon: <HomeIcon /> },
  { link: "/settings", name: "Settings", icon: <SettingsIcon /> },
  { link: "/profile", name: "Profile", icon: <PersonIcon /> },
];

export const statusColorGenerator = (status: string) => {
  if (status === "In inventory") {
    return "success.main";
  }

  if (status === "For repair") {
    return "info.main";
  }

  if (status === "To condemn") {
    return "warning.main";
  }

  if (status === "Condemned") {
    return "error.main";
  }
};

export const statusColorGeneratorLight = (status: string) => {
  if (status === "In inventory") {
    return "success.light";
  }

  if (status === "For repair") {
    return "info.light";
  }

  if (status === "To condemn") {
    return "warning.light";
  }

  if (status === "Condemned") {
    return "error.light";
  }
};

export const getFormattedDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return month + "/" + day + "/" + year;
};
