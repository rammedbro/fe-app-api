import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import process from 'node:process';

const prisma = new PrismaClient();
const dimensions: { landscape: [number, number][]; portrait: [number, number][] } = {
  landscape: [
    [1920, 1080],
    [1440, 900],
    [1280, 720],
    [1024, 768],
    [640, 360],
  ],
  portrait: [],
};
const {
  number: { int },
  helpers: { arrayElement },
} = faker;

async function seed() {
  try {
    // Add avatar to users
    for (const item of await prisma.user.findMany()) {
      if (!item.avatar) continue;

      await prisma.user.update({
        where: { id: item.id },
        data: {
          avatar: faker.image.avatar(),
        },
      });
    }

    // Add images to cars
    for (const item of await prisma.car.findMany()) {
      await prisma.car.update({
        where: { id: item.id },
        data: {
          images: Array(int({ min: 1, max: 10 }))
            .fill(null)
            .map(() => {
              const [width, height] = arrayElement(dimensions.landscape);
              return faker.image.urlLoremFlickr({
                width,
                height,
                category: 'cars',
              });
            }),
        },
      });
    }

    // Add pickup, dropoff to orders
    for (const item of await prisma.order.findMany()) {
      const start = faker.date.between({
        from: '2024-01-01',
        to: '2025-01-01',
      });
      const finish = new Date(start.getTime());
      finish.setDate(start.getDate() + int({ min: 1, max: 7 }));

      await prisma.order.update({
        where: { id: item.id },
        data: {
          pickup: {
            location: {
              latitude: faker.location.latitude(),
              longitude: faker.location.longitude(),
            },
            date: start,
          },
          dropoff: {
            location: {
              latitude: faker.location.latitude(),
              longitude: faker.location.longitude(),
            },
            date: finish,
          },
        },
      });
    }
  } finally {
    prisma.$disconnect();
  }
}

async function main() {
  switch (process.argv[2]) {
    case 'seed':
      await seed();
      break;
    default:
      throw new Error('Invalid command. Available commands are "seed".');
  }
}

main().catch(console.error);
