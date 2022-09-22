-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_sheetId_fkey";

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_sheetId_fkey" FOREIGN KEY ("sheetId") REFERENCES "Sheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
