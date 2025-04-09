/*
  Warnings:

  - You are about to drop the column `dislike_count` on the `YoutubeVideo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "YoutubeVideo" DROP COLUMN "dislike_count",
ADD COLUMN     "tags" TEXT;
