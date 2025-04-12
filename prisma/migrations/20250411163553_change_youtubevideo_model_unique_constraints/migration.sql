/*
  Warnings:

  - You are about to drop the column `channel_id` on the `GeneratedIdea` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,channel_id,video_id]` on the table `YoutubeVideo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "YoutubeVideo_video_id_key";

-- AlterTable
ALTER TABLE "GeneratedIdea" DROP COLUMN "channel_id";

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeVideo_user_id_channel_id_video_id_key" ON "YoutubeVideo"("user_id", "channel_id", "video_id");
