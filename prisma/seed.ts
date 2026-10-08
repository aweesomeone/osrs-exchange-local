import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.appSetting.upsert({
    where: { key: 'refreshIntervalMs' },
    update: { value: '60000' },
    create: { key: 'refreshIntervalMs', value: '60000' }
  });

  await prisma.appSetting.upsert({
    where: { key: 'defaultTaxRate' },
    update: { value: '0.2' },
    create: { key: 'defaultTaxRate', value: '0.2' }
  });

  await prisma.appSetting.upsert({
    where: { key: 'compactNumbers' },
    update: { value: 'false' },
    create: { key: 'compactNumbers', value: 'false' }
  });
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
