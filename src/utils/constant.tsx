import DashboardIcon from "@mui/icons-material/Dashboard";

// import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

export const drawerItem = [{ link: "/dashboard", name: "Dashboard", icon: <DashboardIcon /> }];

export const drawerSettings = [
  // { link: "/settings", name: "Settings", icon: <SettingsIcon /> },
  // { link: "/profile", name: "Profile", icon: <PersonIcon /> },
];

export const statusColorGenerator = (status: string) => {
  if (status === "In inventory") {
    return "primary.main";
  }

  if (status === "For repair") {
    return "info.main";
  }

  if (status === "Unserviceable") {
    return "grey.500";
  }

  if (status === "To condemn") {
    return "warning.main";
  }

  if (
    status === "Department" ||
    status === "Ownership" ||
    status === "Condition" ||
    status === "Edit Name"
  ) {
    return "#DA8A56";
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

export const departments = [
  { name: "OFFICE OF THE PROVINCIAL GOVERNOR", acronym: "PGO" },
  { name: "METRO BATAAN DEVELOPMENT AUTHORITY", acronym: "MBDA" },
  { name: "PROVINCIAL DISASTER RISK REDUCTION AND MANAGEMENT OFFICE", acronym: "PDRRMO" },
  { name: "BATAAN PUBLIC-PRIVATE PARTNERSHIP AND INVESTMENT CENTER", acronym: "PPIC" },
  { name: "OFFICE OF THE PROVINCIAL WARDEN", acronym: "OPW" },
  { name: "SANGGUNIANG PANLALAWIGAN", acronym: "SP" },
  { name: "OFFICE OF THE PROVINCIAL ADMINISTRATOR", acronym: "ADMINISTRATOR" },
  { name: "PROVINCIAL HUMAN RESOURCE MANAGEMENT OFFICE", acronym: "PHRMO" },
  { name: "PROVINCIAL PLANNING AND DEVELOPMENT OFFICE", acronym: "PPDO" },
  { name: "PROVINCIAL GENERAL SERVICES OFFICE", acronym: "PGSO" },
  { name: "PROVINCIAL BUDGET OFFICE", acronym: "BUDGET" },
  { name: "OFFICE OF THE PROVINCIAL ACCOUNTANT", acronym: "ACCOUNTING" },
  { name: "OFFICE OF THE PROVINCIAL TREASURER", acronym: "PTO" },
  { name: "OFFICE OF THE PROVINCIAL ASSESSOR", acronym: "ASSESSOR" },
  { name: "PROVINCIAL INFORMATION OFFICE", acronym: "PIO" },
  { name: "PROVINCIAL INFORMATION TECHNOLOGY OFFICE", acronym: "PITO" },
  { name: "PROVINCIAL LEGAL OFFICE", acronym: "PLO" },
  { name: "PROVINCIAL HEALTH OFFICE", acronym: "PHO" },
  { name: "ORANI DISTRICT HOSPITAL", acronym: "ODH" },
  { name: "JOSE C. PAYUMO, JR. MEMORIAL HOSPITAL", acronym: "JCPAYUMO" },
  { name: "BAGAC COMMUNITY AND MEDICARE HOSPITAL", acronym: "BCMH" },
  { name: "MARIVELES DISTRICT HOSPITAL", acronym: "MDH" },
  { name: "PROVINCIAL SOCIAL WELFARE AND DEVELOPMENT OFFICE", acronym: "PSWDO" },
  { name: "PROVINCIAL POPULATION OFFICE", acronym: "PPO" },
  { name: "PROVINCIAL TOURISM OFFICE", acronym: "TOURISM" },
  { name: "PUBLIC EMPLOYMENT SERVICE OFFICE", acronym: "PESO" },
  { name: "BATAAN HUMAN SETTLEMENT OFFICE", acronym: "BHSO" },
  { name: "OFFICE OF THE PROVINCIAL AGRICULTURIST", acronym: "OPA" },
  { name: "OFFICE OF THE PROVINCIAL VETERINARIAN", acronym: "VET" },
  { name: "PROVINCIAL GOVERNMENT - ENVIRONMENT AND NATURAL RESOURCES OFFICE", acronym: "PENRO" },
  { name: "OFFICE OF THE PROVINCIAL ENGINEER", acronym: "PEO" },
  { name: "PROVINCIAL COOPERATIVE AND ENTERPRISE DEVELOPMENT OFFICE", acronym: "PCEDO" },
  { name: "COMMISSION ON AUDIT", acronym: "COA" },
  { name: "ISKOLAR NG BATAAN", acronym: "ISKOLAR" },
  { name: "BIDS AND AWARD COMMITTEE", acronym: "BAC" },
  { name: "CULTURAL AND HERITAGE PRESERVATION TEAM", acronym: "CULTURAL" },
  { name: "INTERNAL AUDIT SERVICES", acronym: "IAS" },
  { name: "OFFICE OF THE STRATEGIC MANAGEMENT", acronym: "OSM" },
  { name: "OFFICE OF THE VICE GOVERNOR", acronym: "VICEGOV" },
  { name: "PROVINCIAL POPULATION OFFICE", acronym: "POPCOM" },
].sort((a, b) => a.acronym.localeCompare(b.acronym));

export const conditions = [
  { name: "In PGSO inventory and in office", value: "IIIO" },
  {
    name: "In PGSO inventory but not in office",
    value: "IINO",
  },
  {
    name: "In office but not in inventory of PGSO",
    value: "NIIO",
  },
];
