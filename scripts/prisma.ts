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
  ],
  portrait: [],
};
const {
  number: { int },
  helpers: { arrayElement },
} = faker;

async function seed() {
  try {
    /**
     * Add avatar to users
     */
    for (const item of await prisma.user.findMany()) {
      await prisma.user.update({
        where: { id: item.id },
        data: {
          avatar: faker.image.avatar(),
        },
      });
    }

    /**
     * Add images to cars
     */
    const carImages = [
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_a5fd58093a23fb9a4682c30d9396e610.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_3b1788d9c3d6acba067598702c2cb912.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_a07ec028bfd0cea8c8150ea0781d4383.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_7cf1706cbe16f57cd59a6855cf8eec86.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_cda7a58935caec26ee8d8b7ea5969568.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_56d1d0152b7c7afc48f5dc1f37c7432b.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_c0af28824e53d746792663ec8d30e815.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_e4fbac0251886ff85413419134c2de72.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_8a50aeb4cc5558b364f813d59401dbf6.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_aa5c6ec8df14f72b56496ae8712c2378.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_01014f71ca7a94a5f4ed4c974183e4f9.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_aa129fe0278071ca8254672cbd13f5c9.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_b3409ad578a0a168a1cef8a39cfea7dd.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_08a149a0710d426903bbbfe83ec88bdd.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_d9e3b0623bd3495017679488507cf01d.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_50639dd2fdaf74de797e3fc211de60ef.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_d7b326c9bdf12a4149cca030c60b2846.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_9f143274133ddbb3c79260dd778308b5.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_135d6ef599c08179319b08ef825aaacb.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_447e37f00d655ab667543fa7e7bd0401.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_6edd92d4848232b46d24c13074358d06.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_6e51bd3a82f26465340bc1dd5de76694.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_a5d7ac20e89a5dd8dd5078d75fc810b0.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_1914408b812d52685ccc968108e49eb2.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_9de3ff4ce3f967c2b380f1d62b89ff3e.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_9336edf7a7bb2e0c16b5176968887808.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_17f5a9c7f49f8f3f7a94adc287c284a5.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_68db2d58223f3d81fc38fc461c509039.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_2ebcd8691fbf91b624df74f1e342274b.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_e26d5f07f7dd402c68354f0d517314cc.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_26c8945c7a2da060d3bae91cd97b1501.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_8de5735d098fa836f9d2c657aaf1c98e.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_89e8d58cc9baf4fa45b575843391f1e3.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_6ed4634c3bcc1c1e2298559d74f44159.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_c3e763119fe429bda2b74baff6a25261.webp',
      'https://file.aiquickdraw.com/imgcompressed/img/compressed_f6852fa8bd1117f54491a046ac8b5315.webp',
    ];
    for (const item of await prisma.car.findMany()) {
      const cover = arrayElement(carImages);
      const gallery = Array(int({ min: 1, max: 10 }))
        .fill(null)
        .map(() => {
          const [width, height] = arrayElement(dimensions.landscape);
          return faker.image.urlPicsumPhotos({
            width,
            height,
            blur: 0,
            grayscale: false,
          });
        });

      await prisma.car.update({
        where: { id: item.id },
        data: { images: [cover, ...gallery] },
      });
    }

    /**
     * Add pickup, dropoff to orders
     */
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
            date: start.toISOString(),
          },
          dropoff: {
            location: {
              latitude: faker.location.latitude(),
              longitude: faker.location.longitude(),
            },
            date: finish.toISOString(),
          },
        },
      });
    }

    /**
     * Set internal id counters to current records count
     * @see https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#considerations
     */
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id)+1, 1), false) FROM "User";`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Car"', 'id'), coalesce(max(id)+1, 1), false) FROM "Car";`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Review"', 'id'), coalesce(max(id)+1, 1), false) FROM "Review";`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Order"', 'id'), coalesce(max(id)+1, 1), false) FROM "Order";`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Notification"', 'id'), coalesce(max(id)+1, 1), false) FROM "Notification";`;
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
