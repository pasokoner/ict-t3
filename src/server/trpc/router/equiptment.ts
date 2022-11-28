import { router, publicProcedure, protectedProcedure } from "../trpc";
import { z } from "zod";

export const equiptmentRouter = router({
  add: protectedProcedure
    .input(
      z.object({
        equiptment: z.object({
          name: z.string().trim().min(1),
          serial: z.string().trim(),
          department: z.string().trim(),
          issuedTo: z.string().trim(),
          usedBy: z.string().trim(),
          status: z.string(),
          date: z.date().nullish(),
          reminder: z.string().trim().nullish(),
        }),

        parts: z
          .array(
            z.object({
              partsName: z.string(),
              partsSerial: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { equiptment, parts } = input;

      let id = "";

      try {
        await ctx.prisma.$transaction(async () => {
          const equiptmentData = await ctx.prisma.equipment.create({
            data: {
              userId: ctx.session.user.id,
              ...equiptment,
              date: equiptment.date ? equiptment.date : new Date(),
              reminder: equiptment.reminder ? equiptment.reminder : null,
              condition: "IIIO",
            },
          });

          if (equiptmentData) {
            const equiptmentHistoryData = await ctx.prisma.equipmentHistory.create({
              data: {
                equiptmentId: equiptmentData.id,
                userId: ctx.session.user.id,
                ...equiptment,
                date: equiptment.date ? equiptment.date : new Date(),
                reminder: equiptment.reminder ? equiptment.reminder : null,
                condition: "IIIO",
              },
            });

            if (parts && equiptmentHistoryData) {
              const formattedParts = parts.map(({ partsName, partsSerial }) => {
                return {
                  name: partsName,
                  serial: partsSerial,
                  status: "In inventory",
                  equiptmentId: equiptmentData.id,
                };
              });

              const formattedHistoryParts = parts.map(({ partsName, partsSerial }) => {
                return {
                  name: partsName,
                  serial: partsSerial,
                  status: "In inventory",
                  equiptmentHistoryId: equiptmentHistoryData.id,
                };
              });

              const partsData = await ctx.prisma.parts.createMany({
                data: formattedParts,
              });

              const partsHistoryData = await ctx.prisma.partsHistory.createMany({
                data: formattedHistoryParts,
              });
            }

            id = equiptmentData.id;
          }
        });
      } catch (error) {
        throw new Error("Adding of equiptment failed");
      }

      return { message: "Added successfully", id: id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.string(),
        date: z.date().optional(),
        reminder: z.string().trim().optional(),

        newParts: z
          .array(
            z.object({
              name: z.string(),
              serial: z.string(),
            })
          )
          .optional(),

        parts: z
          .array(
            z.object({
              id: z.string(),
              status: z.string(),
              name: z.string(),
              serial: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.$transaction(async () => {
          const equiptmentData = await ctx.prisma.equipment.update({
            where: {
              id: input.id,
            },

            data: {
              userId: ctx.session.user.id,
              date: input.date ? input.date : new Date(),
              status: input.status,
              reminder: input.reminder ? input.reminder : null,
            },
          });

          if (input.newParts) {
            const formattedNewParts = input.newParts.map((p) => {
              return {
                ...p,
                status: "In inventory",
                equiptmentId: input.id,
              };
            });

            const newParts = ctx.prisma.parts.createMany({
              data: formattedNewParts,
            });
          }

          if (equiptmentData) {
            const { id, ...exceptId } = equiptmentData;

            const equiptmentHistoryData = await ctx.prisma.equipmentHistory.create({
              data: {
                equiptmentId: id,
                ...exceptId,
              },
            });

            if (input.newParts && equiptmentHistoryData) {
              const formattedNewHistoryParts = input.newParts.map((p) => {
                return {
                  ...p,
                  status: "In inventory",
                  equiptmentHistoryId: equiptmentHistoryData.id,
                };
              });

              const newHistoryParts = ctx.prisma.partsHistory.createMany({
                data: formattedNewHistoryParts,
              });
            }

            if (input.parts && equiptmentHistoryData) {
              const formattedParts = input.parts.map(({ id, ...exceptId }) => {
                return { equiptmentId: equiptmentData.id, ...exceptId };
              });

              const formattedPartsHistory = input.parts.map(({ id, ...exceptId }) => {
                return { ...exceptId, equiptmentHistoryId: equiptmentHistoryData.id };
              });

              input.parts.forEach(async ({ id, ...exceptId }) => {
                await ctx.prisma.parts.update({
                  where: {
                    id: id,
                  },
                  data: exceptId,
                });
              });

              const historyParts = await ctx.prisma.partsHistory.createMany({
                data: formattedPartsHistory,
              });
            }
          }
        });
      } catch (error) {
        console.log(error);
        throw new Error("Adding of equiptment failed");
      }

      return { message: "Added successfully" };
    }),
  condemnParts: protectedProcedure
    .input(
      z.object({
        serial: z.string(),
        id: z.string(),
        date: z.date().optional(),
        reminder: z.string().trim().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.$transaction(async () => {
          const parts = await ctx.prisma.parts.update({
            where: {
              serial: input.serial,
            },

            data: {
              status: "Condemned",
            },
          });

          const equiptmentData = await ctx.prisma.equipment.findFirst({
            where: {
              id: input.id,
            },
          });

          if (equiptmentData) {
            const { id, ...exceptId } = equiptmentData;

            const equiptmentHistoryData = await ctx.prisma.equipmentHistory.create({
              data: {
                ...exceptId,
                equiptmentId: id,
                userId: ctx.session.user.id,
                date: input.date ? input.date : new Date(),
                status: "Condemned",
                reminder: input.reminder ? input.reminder : null,
              },
            });

            if (equiptmentHistoryData) {
              const { id, ...exceptId } = equiptmentHistoryData;
              const { id: partsId, equiptmentId, ...exceptPartsId } = parts;

              const partsHistoryData = await ctx.prisma.partsHistory.create({
                data: {
                  ...exceptPartsId,
                  equiptmentHistoryId: id,
                },
              });
            }
          }
        });
      } catch (error) {
        console.log(error);
        throw new Error("Failed condemning equiptment");
      }

      return { message: "Successfully condemned this parts" };
    }),
  all: protectedProcedure
    .input(
      z.object({
        filter: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const equiptment = await ctx.prisma.equipment.findMany({
        where: {
          status: input.filter,
        },

        orderBy: {
          date: "desc",
        },
      });

      if (input.filter === "Condemned" || input.filter === "To condemn") {
        const parts = await ctx.prisma.parts.findMany({
          where: {
            status: input.filter,
          },

          include: {
            equiptment: true,
          },
        });

        if (parts && parts.length > 0) {
          const formattedParts = parts
            .filter(
              (part) =>
                !(part.equiptment.status === "To condemn" || part.equiptment.status === "Condemned")
            )
            .map(({ equiptment: equiptmentParts, name, status, serial }) => {
              return {
                ...equiptmentParts,
                name: name,
                status: status,
                parts: true,
                serial: serial,
              };
            });

          if (formattedParts.length > 0) {
            if (equiptment.length > 0) {
              const formattedEquiptment = equiptment.map((e) => {
                return { ...e, parts: false };
              });

              return [...formattedEquiptment, ...formattedParts];
            }

            return [...formattedParts];
          }
        }
      }

      return equiptment.map((e) => {
        return { ...e, parts: false };
      });
    }),
  getHistory: protectedProcedure
    .input(
      z.object({
        equiptmentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.equipmentHistory.findMany({
        where: {
          equiptmentId: input.equiptmentId,
        },

        orderBy: {
          date: "desc",
        },

        include: {
          user: true,
        },
      });

      return data;
    }),
  getParts: protectedProcedure
    .input(
      z.object({
        equiptmentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.parts.findMany({
        where: {
          equiptmentId: input.equiptmentId,
        },
      });

      return data;
    }),
  countByStatus: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const inInventory = await ctx.prisma.equipment.count({
      where: {
        status: "In inventory",
      },
    });
    const forRepair = await ctx.prisma.equipment.count({
      where: {
        status: "For repair",
      },
    });
    const unserviceable = await ctx.prisma.equipment.count({
      where: {
        status: "Unserviceable",
      },
    });
    const toCondemn = await ctx.prisma.equipment.count({
      where: {
        status: "To condemn",
      },
    });

    const toCondemnParts = await ctx.prisma.parts.count({
      where: {
        NOT: {
          equiptment: {
            status: "To condemn",
          },
        },
        OR: {
          NOT: {
            equiptment: {
              status: "Condemned",
            },
          },
        },
        status: "To condemn",
      },
    });
    const condemned = await ctx.prisma.equipment.count({
      where: {
        status: "Condemned",
      },
    });

    const condemnedParts = await ctx.prisma.parts.count({
      where: {
        NOT: {
          equiptment: {
            status: "To condemn",
          },
        },
        OR: {
          NOT: {
            equiptment: {
              status: "Condemned",
            },
          },
        },
        status: "Condemned",
      },
    });

    return {
      inInventory,
      forRepair,
      unserviceable,
      toCondemn: toCondemn + toCondemnParts,
      condemned: condemned + condemnedParts,
    };
  }),

  detect: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const data = await ctx.prisma.equipment.findFirst({
      where: {
        id: input.id,
      },
    });

    return data;
  }),
  getDetails: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const current = await ctx.prisma.equipment.findFirst({
      where: {
        id: input.id,
      },

      include: {
        parts: true,
        user: true,
      },
    });

    const history = await ctx.prisma.equipmentHistory.findMany({
      where: {
        equiptmentId: input.id,
      },

      include: {
        partsHistory: true,
        user: true,
      },

      orderBy: {
        date: "desc",
      },
    });

    return { current, history };
  }),
  ownership: protectedProcedure
    .input(
      z.object({
        equiptmentId: z.string(),
        issuedTo: z.string().optional(),
        usedBy: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { issuedTo, usedBy, equiptmentId } = input;

      const newOwner =
        issuedTo && usedBy
          ? { issuedTo: issuedTo, usedBy: usedBy }
          : usedBy && !issuedTo
          ? { usedBy: usedBy }
          : { issuedTo: issuedTo };

      await ctx.prisma.$transaction(async () => {
        const equiptment = await ctx.prisma.equipment.update({
          where: {
            id: equiptmentId,
          },

          data: newOwner,
        });

        if (equiptment) {
          const { id, ...exceptId } = equiptment;
          const equiptmentHistoryData = await ctx.prisma.equipmentHistory.create({
            data: {
              ...exceptId,
              status: "Ownership",
              equiptmentId: id,
              userId: ctx.session.user.id,
              date: new Date(),
              reminder: null,
            },
          });
        }
      });

      return {};
    }),
  department: protectedProcedure
    .input(
      z.object({
        equiptmentId: z.string(),
        department: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { department, equiptmentId } = input;

      await ctx.prisma.$transaction(async () => {
        const equiptment = await ctx.prisma.equipment.update({
          where: {
            id: equiptmentId,
          },

          data: {
            department: department,
          },
        });

        if (equiptment) {
          const { id, ...exceptId } = equiptment;
          const equiptmentHistoryData = await ctx.prisma.equipmentHistory.create({
            data: {
              ...exceptId,
              status: "Department",
              equiptmentId: id,
              userId: ctx.session.user.id,
              date: new Date(),
              reminder: null,
            },
          });
        }
      });

      return {};
    }),
  condition: protectedProcedure
    .input(
      z.object({
        equiptmentId: z.string(),
        condition: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { condition, equiptmentId } = input;

      await ctx.prisma.$transaction(async () => {
        const equiptment = await ctx.prisma.equipment.update({
          where: {
            id: equiptmentId,
          },

          data: {
            condition: condition,
          },
        });

        if (equiptment) {
          const { id, ...exceptId } = equiptment;
          const equiptmentHistoryData = await ctx.prisma.equipmentHistory.create({
            data: {
              ...exceptId,
              status: "Condition",
              equiptmentId: id,
              userId: ctx.session.user.id,
              date: new Date(),
              reminder: null,
            },
          });
        }
      });

      return {};
    }),
  delete: protectedProcedure
    .input(z.object({ equiptmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const data = await ctx.prisma.equipment.delete({
        where: {
          id: input.equiptmentId,
        },
      });

      return { message: "Successfully deleted" };
    }),
});

[{ amount: 10 }, { amount: 20 }, { amount: 50 }].reduce((accumulator, obj) => {
  return accumulator + obj.amount;
}, 0);
