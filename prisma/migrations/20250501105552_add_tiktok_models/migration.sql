/*
  Warnings:

  - You are about to drop the column `instagramVideoId` on the `GeneratedIdea` table. All the data in the column will be lost.
  - You are about to drop the column `access_token` on the `TikTokProfile` table. All the data in the column will be lost.
  - You are about to drop the column `avatar_url` on the `TikTokProfile` table. All the data in the column will be lost.
  - You are about to drop the column `tiktok_id` on the `TikTokProfile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TikTokProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,username]` on the table `TikTokProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `TikTokProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_picture` to the `TikTokProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_url` to the `TikTokProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GeneratedIdea" DROP CONSTRAINT "GeneratedIdea_instagramVideoId_fkey";

-- DropForeignKey
ALTER TABLE "TikTokProfile" DROP CONSTRAINT "TikTokProfile_userId_fkey";

-- DropIndex
DROP INDEX "InstagramVideo_media_id_key";

-- DropIndex
DROP INDEX "TikTokProfile_tiktok_id_key";

-- AlterTable
ALTER TABLE "GeneratedIdea" DROP COLUMN "instagramVideoId",
ADD COLUMN     "instagram_video_id" TEXT,
ADD COLUMN     "tiktok_profile_id" TEXT,
ADD COLUMN     "tiktok_video_id" TEXT;

-- AlterTable
ALTER TABLE "TikTokProfile" DROP COLUMN "access_token",
DROP COLUMN "avatar_url",
DROP COLUMN "tiktok_id",
DROP COLUMN "userId",
ADD COLUMN     "followers_count" INTEGER,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "profile_picture" TEXT NOT NULL,
ADD COLUMN     "profile_url" TEXT NOT NULL,
ADD COLUMN     "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "total_likes" INTEGER,
ADD COLUMN     "total_videos" INTEGER,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "TikTokVideo" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "hashtags" TEXT,
    "play_count" INTEGER,
    "like_count" INTEGER,
    "comment_count" INTEGER,
    "share_count" INTEGER,
    "collect_count" INTEGER,
    "duration" INTEGER,
    "cover_url" TEXT,
    "video_url" TEXT,
    "published_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TikTokVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TikTokProfile_user_id_idx" ON "TikTokProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "TikTokProfile_user_id_username_key" ON "TikTokProfile"("user_id", "username");

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_tiktok_profile_id_fkey" FOREIGN KEY ("tiktok_profile_id") REFERENCES "TikTokProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_instagram_video_id_fkey" FOREIGN KEY ("instagram_video_id") REFERENCES "InstagramVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_tiktok_video_id_fkey" FOREIGN KEY ("tiktok_video_id") REFERENCES "TikTokVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TikTokProfile" ADD CONSTRAINT "TikTokProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TikTokVideo" ADD CONSTRAINT "TikTokVideo_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "TikTokProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
