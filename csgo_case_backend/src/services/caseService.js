import { getPrisma } from '../db/index.js';
import { weightedRandom } from '../utils/random.js';

/**
 * PUBLIC_INTERFACE
 * listCases
 * Returns all cases with id, name, price
 */
export async function listCases() {
  /** Fetch all cases with minimal fields */
  const prisma = getPrisma();
  const cases = await prisma.case.findMany({
    orderBy: { id: 'asc' },
    select: { id: true, name: true, price: true },
  });
  return cases.map((c) => ({
    id: c.id,
    name: c.name,
    price: Number(c.price),
  }));
}

/**
 * PUBLIC_INTERFACE
 * getCaseById
 * Returns a case with its drop table
 */
export async function getCaseById(id) {
  /** Fetch a single case and include its possible drops with weights */
  const prisma = getPrisma();
  const kase = await prisma.case.findUnique({
    where: { id: Number(id) },
    include: {
      caseItems: {
        include: {
          item: true,
        },
      },
    },
  });
  if (!kase) return null;
  const drops = (kase.caseItems || []).map((ci) => ({
    id: ci.item.id,
    name: ci.item.name,
    rarity: ci.item.rarity,
    value: Number(ci.item.value),
    weight: ci.weight,
  }));
  return {
    id: kase.id,
    name: kase.name,
    price: Number(kase.price),
    drops,
  };
}

/**
 * PUBLIC_INTERFACE
 * openCaseForUser
 * Performs a case opening: charges user, selects an item by weight, stores opening and inventory.
 */
export async function openCaseForUser(userId, caseId) {
  /** Transactionally deduct price, choose weighted item, add to inventory and log opening */
  const prisma = getPrisma();

  return await prisma.$transaction(async (tx) => {
    const kase = await tx.case.findUnique({
      where: { id: Number(caseId) },
      include: {
        caseItems: { include: { item: true } },
      },
    });
    if (!kase) throw new Error('Case not found');

    const user = await tx.user.findUnique({ where: { id: Number(userId) } });
    if (!user) throw new Error('User not found');

    const price = Number(kase.price);
    const balance = Number(user.balance);
    if (balance < price) {
      throw new Error('Insufficient balance');
    }

    const items = kase.caseItems.map((ci) => ci.item);
    const weights = kase.caseItems.map((ci) => ci.weight);
    if (!items.length) throw new Error('Case has no items');

    const idx = weightedRandom(items, weights);
    const won = items[idx];

    // Deduct balance
    await tx.user.update({
      where: { id: user.id },
      data: {
        balance: (balance - price).toString(),
      },
    });

    // Add to inventory
    const inv = await tx.inventory.create({
      data: { userId: user.id, itemId: won.id },
    });

    // Record opening
    await tx.opening.create({
      data: {
        userId: user.id,
        caseId: kase.id,
        itemId: won.id,
        price: price.toString(),
      },
    });

    return {
      item: {
        id: won.id,
        name: won.name,
        rarity: won.rarity,
        value: Number(won.value),
        inventoryId: inv.id,
      },
      newBalance: balance - price,
    };
  });
}
