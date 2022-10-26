import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const equiptmentRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1),
        status: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.prisma.equipment.create({
        data: { name: input.name, status: input.status },
      });

      return data;
    }),
  detect: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const data = await ctx.prisma.equipment.findFirst({
      where: {
        id: input.id,
      },
    });

    return data;
  }),
});
