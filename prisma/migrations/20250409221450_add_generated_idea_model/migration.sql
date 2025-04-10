-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'TWITTER');

-- CreateTable
CREATE TABLE "GeneratedIdea" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "context_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "PlatformType" NOT NULL DEFAULT 'YOUTUBE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedIdea_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "YoutubeChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedIdea" ADD CONSTRAINT "GeneratedIdea_context_id_fkey" FOREIGN KEY ("context_id") REFERENCES "YoutubeVideo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
