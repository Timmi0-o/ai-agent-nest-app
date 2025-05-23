-- DropForeignKey
ALTER TABLE "channel" DROP CONSTRAINT "channel_character_id_fkey";

-- AlterTable
ALTER TABLE "channel" ALTER COLUMN "character_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "channel" ADD CONSTRAINT "channel_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "character"("id") ON DELETE SET NULL ON UPDATE CASCADE;
