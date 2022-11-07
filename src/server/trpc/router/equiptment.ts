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
  all: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.equipment.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { equipmentHistory: true },
        },
        equipmentHistory: {
          select: {
            reminder: true,
            status: true,
            date: true,
            user: true,
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    const format = data.map((all) => {
      return {
        id: all.id,
        name: all.name,
        handler: all.equipmentHistory[0]?.user?.name,
        numOfTransactions: all._count,
        lastChecked: all.equipmentHistory[0]?.date,
        status: all.equipmentHistory[0]?.status,
        history: all.equipmentHistory.map((h) => {
          return { date: h.date, handler: h.user.name, status: h.status };
        }),
      };
    });

    return format;
  }),

  countByStatus: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.equipmentHistory.findMany({
      distinct: ["equiptmentId"],
      orderBy: {
        date: "desc",
      },
    });

    const inInventory = data.filter((e) => e.status === "In inventory").length;
    const forRepair = data.filter((e) => e.status === "For repair").length;
    const toCondemn = data.filter((e) => e.status === "To condemn").length;
    const condemned = data.filter((e) => e.status === "Condemned").length;

    return {
      inInventory,
      forRepair,
      toCondemn,
      condemned,
    };
  }),

  detect: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const data = await ctx.prisma.equipment.findFirst({
      where: {
        id: input.id,
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: { equipmentHistory: true },
        },
        equipmentHistory: {
          select: {
            reminder: true,
            status: true,
            date: true,
            user: true,
          },
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    return data;
  }),
});
