import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";
import { Groups, Role } from "@prisma/client";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getPendingAccounts: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.user.findMany({
      where: {
        role: null,
        group: null,
      },
    });

    return data;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  getAdminGroupMember: protectedProcedure.query(async ({ ctx }) => {
    const userGroup = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    const data = await ctx.prisma.user.findMany({
      where: {
        group: userGroup?.group,
      },
    });

    return data;
  }),
  getByGroup: protectedProcedure
    .input(z.object({ group: z.enum(["GSO", "PITO"]) }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.user.findMany({
        where: {
          group: input.group === "PITO" ? Groups.PITO : Groups.GSO,
        },
      });

      return data;
    }),
  updatePermission: protectedProcedure
    .input(
      z.object({
        role: z.enum(["ADMIN", "USER"] as const),
        group: z.enum(["PITO", "GSO"] as const),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const data = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          group: input.group === "PITO" ? Groups.PITO : Groups.GSO,
          role: input.role === "ADMIN" ? Role.ADMIN : Role.USER,
        },
      });

      return { message: "Successfully updated permission", data };
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });

      return { message: "User Successfully deleted" };
    }),
});
