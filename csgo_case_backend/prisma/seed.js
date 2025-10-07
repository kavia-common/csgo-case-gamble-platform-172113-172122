import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Utility to ensure numeric literals are Decimal.safe via JS numbers/strings
 */
const d = (n) => n.toString();

async function main() {
  console.log('Seeding database...');
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      steamId: null,
      balance: d(250.00),
    },
  });

  // Items catalog
  const itemsData = [
    { name: 'P2000 | Oceanic', rarity: 'Common', value: d(0.25) },
    { name: 'AK-47 | Redline', rarity: 'Rare', value: d(8.5) },
    { name: 'AWP | Asiimov', rarity: 'Epic', value: d(45.0) },
    { name: 'Karambit | Fade', rarity: 'Legendary', value: d(350.0) },
    { name: 'Desert Eagle | Blaze', rarity: 'Epic', value: d(120.0) },
    { name: 'M4A4 | Neo-Noir', rarity: 'Rare', value: d(22.0) },
    { name: 'Glock-18 | Water Elemental', rarity: 'Uncommon', value: d(4.0) },
    { name: 'USP-S | Cortex', rarity: 'Uncommon', value: d(3.0) },
    { name: 'AK-47 | Vulcan', rarity: 'Epic', value: d(160.0) },
    { name: 'Butterfly Knife | Doppler', rarity: 'Legendary', value: d(600.0) },
  ];

  const createdItems = [];
  for (const it of itemsData) {
    const ci = await prisma.item.upsert({
      where: { name: it.name },
      update: { rarity: it.rarity, value: it.value },
      create: it,
    });
    createdItems.push(ci);
  }

  // Cases
  const casesData = [
    { name: 'Starter Case', price: d(1.99) },
    { name: 'Pro Case', price: d(9.99) },
    { name: 'Elite Case', price: d(49.99) },
  ];

  const createdCases = [];
  for (const c of casesData) {
    const cc = await prisma.case.upsert({
      where: { name: c.name },
      update: { price: c.price },
      create: c,
    });
    createdCases.push(cc);
  }

  // Map case items with weights (simple distribution)
  const byName = Object.fromEntries(createdItems.map(i => [i.name, i]));

  // Starter Case: mostly common/uncommon, rare low chance
  const starterWeights = [
    { item: 'P2000 | Oceanic', weight: 600 },
    { item: 'Glock-18 | Water Elemental', weight: 250 },
    { item: 'USP-S | Cortex', weight: 250 },
    { item: 'AK-47 | Redline', weight: 40 },
    { item: 'M4A4 | Neo-Noir', weight: 20 },
  ];

  // Pro Case: a bit of epic, rare decent, small legendary
  const proWeights = [
    { item: 'Glock-18 | Water Elemental', weight: 280 },
    { item: 'USP-S | Cortex', weight: 260 },
    { item: 'AK-47 | Redline', weight: 160 },
    { item: 'M4A4 | Neo-Noir', weight: 120 },
    { item: 'AWP | Asiimov', weight: 45 },
    { item: 'Desert Eagle | Blaze', weight: 25 },
  ];

  // Elite Case: epic and some legendary, tiny chance top knife
  const eliteWeights = [
    { item: 'AK-47 | Vulcan', weight: 140 },
    { item: 'AWP | Asiimov', weight: 160 },
    { item: 'Desert Eagle | Blaze', weight: 120 },
    { item: 'Karambit | Fade', weight: 8 },
    { item: 'Butterfly Knife | Doppler', weight: 4 },
    { item: 'M4A4 | Neo-Noir', weight: 100 },
  ];

  const caseWeights = {
    'Starter Case': starterWeights,
    'Pro Case': proWeights,
    'Elite Case': eliteWeights,
  };

  for (const c of createdCases) {
    const weights = caseWeights[c.name] || [];
    // Clear and reinsert (idempotent via unique on [caseId,itemId])
    for (const w of weights) {
      const itm = byName[w.item];
      if (!itm) continue;
      await prisma.caseItem.upsert({
        where: { caseId_itemId: { caseId: c.id, itemId: itm.id } },
        update: { weight: w.weight },
        create: { caseId: c.id, itemId: itm.id, weight: w.weight },
      });
    }
  }

  // Give the demo user a couple of starting items
  const starterGifts = ['P2000 | Oceanic', 'USP-S | Cortex'];
  for (const name of starterGifts) {
    const itm = byName[name];
    if (itm) {
      await prisma.inventory.create({
        data: { userId: demoUser.id, itemId: itm.id },
      });
    }
  }

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
