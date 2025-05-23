-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('user', 'admin');

-- DropIndex
DROP INDEX "user_id_key";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "UserRoles" NOT NULL DEFAULT 'user';
