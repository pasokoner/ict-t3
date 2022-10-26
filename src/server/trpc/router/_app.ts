// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { equiptmentRouter } from "./equiptment";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  equiptment: equiptmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
