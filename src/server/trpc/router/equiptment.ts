import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const equiptmentRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1),
        status: z.string(),
        date: z.date().nullish(),
        reminder: z.string().trim().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const data = await ctx.prisma.equipment.create({
        data: {
          name: input.name,

          equipmentHistory: {
            create: [
              {
                userId: ctx.session.user.id,
                date: input.date ? input.date : new Date(),
                status: input.status,
                reminder: input.reminder ? input.reminder : null,
              },
            ],
          },
        },

        include: {
          equipmentHistory: true,
        },
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
