/*
  Warnings:

  - You are about to drop the column `youtubeVideoId` on the `GeneratedIdea` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GeneratedIdea" DROP CONSTRAINT "GeneratedIdea_youtubeVideoId_fkey";

-- AlterTable
ALTER TABLE "GeneratedIdea" DROP COLUMN "youtubeVideoId",
ADD COLUMN     "youtube_video_id" TEXT;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_youtube_video_id_fkey" FOREIGN KEY ("youtube_video_id") REFERENCES "YoutubeVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
