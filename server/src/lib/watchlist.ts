import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const watchlistItemSchema = z.object({
  itemId: z.number().int().positive(),
  targetBuy: z.number().int().nonnegative().nullable().optional(),
  targetSell: z.number().int().nonnegative().nullable().optional(),
  notes: z.string().max(2000).nullable().optional()
});

export async function getWatchlist() {
  return prisma.watchlistItem.findMany({
    orderBy: { updatedAt: 'desc' }
  });
}

export async function upsertWatchlistItem(input: z.infer<typeof watchlistItemSchema>) {
  return prisma.watchlistItem.upsert({
    where: { itemId: input.itemId },
    update: {
      targetBuy: input.targetBuy ?? undefined,
      targetSell: input.targetSell ?? undefined,
      notes: input.notes ?? undefined
    },
    create: {
      itemId: input.itemId,
      targetBuy: input.targetBuy ?? null,
      targetSell: input.targetSell ?? null,
      notes: input.notes ?? null
    }
  });
}

export async function deleteWatchlistItem(itemId: number) {
  return prisma.watchlistItem.delete({
    where: { itemId }
  });
}
