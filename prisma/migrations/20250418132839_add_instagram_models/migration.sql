-- CreateTable
CREATE TABLE "TikTokProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "tiktok_id" TEXT NOT NULL,
    "access_token" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TikTokProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramProfile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ig_user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "profile_picture" TEXT,
    "access_token" TEXT NOT NULL,
    "token_expires_at" TIMESTAMP(3) NOT NULL,
    "synced_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramVideo" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "media_url" TEXT NOT NULL,
    "shortcode" TEXT NOT NULL,
    "caption" TEXT,
    "hashtags" TEXT,
    "thumbnail_url" TEXT,
    "timestamp" TIMESTAMP(3),
    "like_count" INTEGER,
    "comment_count" INTEGER,
    "view_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramVideo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TikTokProfile_tiktok_id_key" ON "TikTokProfile"("tiktok_id");

-- CreateIndex
CREATE INDEX "InstagramProfile_user_id_idx" ON "InstagramProfile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramProfile_user_id_ig_user_id_key" ON "InstagramProfile"("user_id", "ig_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramVideo_media_id_key" ON "InstagramVideo"("media_id");

-- RenameForeignKey
ALTER TABLE "GeneratedIdea" RENAME CONSTRAINT "GeneratedIdea_context_id_fkey" TO "fk_youtube_video";

-- RenameForeignKey
ALTER TABLE "GeneratedIdea" RENAME CONSTRAINT "GeneratedIdea_source_id_fkey" TO "fk_youtube_channel";

-- AddForeignKey
ALTER TABLE "TikTokProfile" ADD CONSTRAINT "TikTokProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "fk_instagram_profile" FOREIGN KEY ("source_id") REFERENCES "InstagramProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "fk_instagram_video" FOREIGN KEY ("context_id") REFERENCES "InstagramVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstagramProfile" ADD CONSTRAINT "InstagramProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstagramVideo" ADD CONSTRAINT "InstagramVideo_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "InstagramProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
