-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "money" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "partyMoney" DOUBLE PRECISION NOT NULL DEFAULT 0;
