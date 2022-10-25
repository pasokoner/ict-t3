// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { qrCodeRouter } from "./qrcode";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  qrcode: qrCodeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
