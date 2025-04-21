/*
  Warnings:

  - You are about to drop the column `access_token` on the `InstagramProfile` table. All the data in the column will be lost.
  - You are about to drop the column `ig_user_id` on the `InstagramProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `InstagramProfile` table. All the data in the column will be lost.
  - You are about to drop the column `token_expires_at` on the `InstagramProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,username]` on the table `InstagramProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "InstagramProfile_user_id_ig_user_id_key";

-- AlterTable
ALTER TABLE "InstagramProfile" DROP COLUMN "access_token",
DROP COLUMN "ig_user_id",
DROP COLUMN "profile_picture",
DROP COLUMN "token_expires_at";

-- CreateIndex
CREATE UNIQUE INDEX "InstagramProfile_user_id_username_key" ON "InstagramProfile"("user_id", "username");

-- RenameForeignKey
ALTER TABLE "GeneratedIdea" RENAME CONSTRAINT "fk_instagram_profile" TO "profile_id";

-- RenameForeignKey
ALTER TABLE "GeneratedIdea" RENAME CONSTRAINT "fk_youtube_channel" TO "channel_id";
