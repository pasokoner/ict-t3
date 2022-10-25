import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const qrCodeRouter = router({
  add: publicProcedure.input(z.object({ name: z.string() })).mutation(async ({ input, ctx }) => {
    const data = await ctx.prisma.equipment.create({
      data: { name: input.name },
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
