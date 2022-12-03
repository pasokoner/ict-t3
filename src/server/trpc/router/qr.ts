import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const qrRouter = router({
  newQr: protectedProcedure
    .input(
      z.object({
        newQr: z.array(
          z
            .object({
              id: z.string(),
              department: z.string(),
              quantity: z.number(),
            })
            .optional()
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },

        data: input.newQr,
      });

      return {};
    }),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.qr.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
});
