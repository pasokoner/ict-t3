import { router, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getUserInfo: protectedProcedure.query(({ ctx }) => {
    const { user } = ctx.session;
    const data = ctx.prisma.user.findFirst({
      where: {
        id: user.id,
      },
    });

    return data;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
});
