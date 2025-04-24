/*
  Warnings:

  - You are about to drop the column `context_id` on the `GeneratedIdea` table. All the data in the column will be lost.
  - You are about to drop the column `source_id` on the `GeneratedIdea` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GeneratedIdea" DROP CONSTRAINT "channel_id";

-- DropForeignKey
ALTER TABLE "GeneratedIdea" DROP CONSTRAINT "fk_instagram_video";

-- DropForeignKey
ALTER TABLE "GeneratedIdea" DROP CONSTRAINT "fk_youtube_video";

-- DropForeignKey
ALTER TABLE "GeneratedIdea" DROP CONSTRAINT "profile_id";

-- AlterTable
ALTER TABLE "GeneratedIdea" DROP COLUMN "context_id",
DROP COLUMN "source_id",
ADD COLUMN     "instagramVideoId" TEXT,
ADD COLUMN     "instagram_profile_id" TEXT,
ADD COLUMN     "youtubeVideoId" TEXT,
ADD COLUMN     "youtube_channel_id" TEXT;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_youtube_channel_id_fkey" FOREIGN KEY ("youtube_channel_id") REFERENCES "YoutubeChannel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_instagram_profile_id_fkey" FOREIGN KEY ("instagram_profile_id") REFERENCES "InstagramProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_youtubeVideoId_fkey" FOREIGN KEY ("youtubeVideoId") REFERENCES "YoutubeVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_instagramVideoId_fkey" FOREIGN KEY ("instagramVideoId") REFERENCES "InstagramVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
