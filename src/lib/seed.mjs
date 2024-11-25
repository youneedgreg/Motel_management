import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedRooms() {
  try {
    await prisma.room.createMany({
      data: [
        { number: 1, status: 'free' },
        { number: 2, status: 'free' },
        { number: 3, status: 'free' },
        { number: 4, status: 'free' },
        { number: 5, status: 'free' },
        { number: 6, status: 'free' },
        { number: 7, status: 'free' },
      ],
    });

    console.log('Rooms seeded successfully!');
  } catch (error) {
    console.error('Error seeding rooms:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedRooms();