import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@kshop.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@kshop.com',
      password: await bcrypt.hash('admin123', 10),
      isAdmin: true,
    },
  });
  console.log('Admin created: admin@kshop.com / admin123');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());