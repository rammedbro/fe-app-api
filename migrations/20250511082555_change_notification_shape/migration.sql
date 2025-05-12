-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('UserCreated', 'OrderCreated');

-- DropIndex
DROP INDEX "Order_phone_key";

-- AlterTable
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId", "carId");

-- DropIndex
DROP INDEX "Favorite_userId_carId_key";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "text",
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "type" "NotificationType" NOT NULL,
ALTER COLUMN "isSeen" SET DEFAULT false;
