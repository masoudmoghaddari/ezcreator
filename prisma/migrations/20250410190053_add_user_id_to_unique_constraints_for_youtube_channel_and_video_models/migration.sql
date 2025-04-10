/*
  Warnings:

  - A unique constraint covering the columns `[user_id,channel_id]` on the table `YoutubeChannel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `YoutubeVideo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "YoutubeChannel_channel_id_key";

-- AlterTable
ALTER TABLE "YoutubeVideo" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeChannel_user_id_channel_id_key" ON "YoutubeChannel"("user_id", "channel_id");

-- AddForeignKey
ALTER TABLE "YoutubeVideo" ADD CONSTRAINT "YoutubeVideo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
