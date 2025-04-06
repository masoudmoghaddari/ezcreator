-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'PRO_PLUS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "external_id" TEXT,
    "email" TEXT,
    "email_confirmed_at" TIMESTAMP(3),
    "first_name" TEXT,
    "last_name" TEXT,
    "avatar_url" TEXT,
    "onboarding_complete" BOOLEAN NOT NULL DEFAULT false,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "subscriptionDate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeChannel" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YoutubeVideo" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "video_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "duration" INTEGER,
    "view_count" INTEGER,
    "like_count" INTEGER,
    "dislike_count" INTEGER,
    "comment_count" INTEGER,
    "published_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YoutubeVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_external_id_key" ON "User"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_external_id_idx" ON "User"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeChannel_channel_id_key" ON "YoutubeChannel"("channel_id");

-- CreateIndex
CREATE INDEX "YoutubeChannel_user_id_idx" ON "YoutubeChannel"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "YoutubeVideo_video_id_key" ON "YoutubeVideo"("video_id");

-- AddForeignKey
ALTER TABLE "YoutubeChannel" ADD CONSTRAINT "YoutubeChannel_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YoutubeVideo" ADD CONSTRAINT "YoutubeVideo_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "YoutubeChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
