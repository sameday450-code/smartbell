const prisma = require('../src/config/database');
const { hashPassword } = require('../src/utils/crypto');

async function main() {
  console.log('Seeding database...');

  // Create super admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@smartbell.io' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'superadmin@smartbell.io',
      password: await hashPassword('SuperAdmin@123'),
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });
  console.log('Super admin created:', superAdmin.email);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
