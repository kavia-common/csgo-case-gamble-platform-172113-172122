import { getPrisma } from '../db/index.js';

/**
 * PUBLIC_INTERFACE
 * getInventoryForUser
 * Returns a list of items in the user's inventory with item details.
 */
export async function getInventoryForUser(userId) {
  /** Fetch inventory items for the given user */
  const prisma = getPrisma();
  const inv = await prisma.inventory.findMany({
    where: { userId: Number(userId) },
    orderBy: { id: 'desc' },
    include: { item: true },
  });
  return inv.map((r) => ({
    id: r.id,
    name: r.item.name,
    rarity: r.item.rarity,
    value: Number(r.item.value),
    obtainedAt: r.obtainedAt,
  }));
}

/**
 * PUBLIC_INTERFACE
 * sellInventoryItem
 * Optional stub to simulate selling an inventory item - credits user's balance by item value.
 */
export async function sellInventoryItem(userId, inventoryId) {
  /** Simulates selling an item by crediting its value to the user's balance and removing it */
  const prisma = getPrisma();
  return await prisma.$transaction(async (tx) => {
    const inv = await tx.inventory.findUnique({
      where: { id: Number(inventoryId) },
      include: { item: true },
    });
    if (!inv || inv.userId !== Number(userId)) throw new Error('Not found');

    const user = await tx.user.findUnique({ where: { id: Number(userId) } });
    const balance = Number(user.balance);
    const value = Number(inv.item.value);

    await tx.user.update({
      where: { id: user.id },
      data: { balance: (balance + value).toString() },
    });

    await tx.inventory.delete({ where: { id: inv.id } });

    return { newBalance: balance + value };
  });
}

/**
 * PUBLIC_INTERFACE
 * withdrawInventoryItem
 * Optional stub; in a real integration would initiate a trade offer.
 */
export async function withdrawInventoryItem(userId, inventoryId) {
  /** Placeholder for withdrawal; no-op success */
  // Implement integration with Steam trade offers in a real system.
  return { status: 'pending', inventoryId: Number(inventoryId), userId: Number(userId) };
}
