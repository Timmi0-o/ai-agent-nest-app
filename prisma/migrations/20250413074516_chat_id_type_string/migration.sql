/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `channel` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "channel" ALTER COLUMN "chat_id" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "channel_user_id_key" ON "channel"("user_id");
