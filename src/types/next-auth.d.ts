import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: "ADMIN" | "SUPERADMIN" | "USER" | null;
      group: "PITO" | "GSO";
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "SUPERADMIN" | "USER" | null;
    group: "PITO" | "GSO";
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: "ADMIN" | "SUPERADMIN" | "USER" | null;
    group: "PITO" | "GSO";
  }
}
