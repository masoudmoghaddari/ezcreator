/*
  Warnings:

  - Added the required column `channel_id` to the `GeneratedIdea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `GeneratedIdea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeneratedIdea" ADD COLUMN     "channel_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
