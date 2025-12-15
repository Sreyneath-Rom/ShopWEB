import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const url = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
});

const prisma = new PrismaClient({ adapter });

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

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
