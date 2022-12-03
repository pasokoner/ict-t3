// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { equiptmentRouter } from "./equiptment";
import { qrRouter } from "./qr";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  equiptment: equiptmentRouter,
  qr: qrRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
