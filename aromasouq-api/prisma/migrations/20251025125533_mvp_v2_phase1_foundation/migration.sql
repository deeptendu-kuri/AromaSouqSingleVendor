-- CreateEnum
CREATE TYPE "CoinTransactionType" AS ENUM ('EARNED', 'SPENT', 'REFUNDED', 'EXPIRED', 'ADMIN_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "CoinSource" AS ENUM ('ORDER_PURCHASE', 'PRODUCT_REVIEW', 'REFERRAL', 'PROMOTION', 'REFUND', 'ADMIN');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('HELPFUL', 'NOT_HELPFUL');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "coins_earned" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "coins_used" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "base_notes" TEXT,
ADD COLUMN     "coins_to_award" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "enable_whatsapp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "heart_notes" TEXT,
ADD COLUMN     "longevity" TEXT,
ADD COLUMN     "sales_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "scent_family" TEXT,
ADD COLUMN     "season" TEXT,
ADD COLUMN     "sillage" TEXT,
ADD COLUMN     "top_notes" TEXT,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "whatsapp_number" TEXT;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "helpful_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "not_helpful_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "vendor_replied_at" TIMESTAMP(3),
ADD COLUMN     "vendor_reply" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferred_language" TEXT NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "vendors" ADD COLUMN     "brand_story" TEXT,
ADD COLUMN     "brand_story_ar" TEXT,
ADD COLUMN     "facebook_url" TEXT,
ADD COLUMN     "instagram_url" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "tagline_ar" TEXT,
ADD COLUMN     "tiktok_url" TEXT,
ADD COLUMN     "twitter_url" TEXT,
ADD COLUMN     "whatsapp_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatsapp_number" TEXT;

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT,
    "sku" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image" TEXT,
    "compare_at_price" DOUBLE PRECISION,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_videos" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "title_ar" TEXT,
    "thumbnail" TEXT,
    "duration" INTEGER,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "lifetime_earned" INTEGER NOT NULL DEFAULT 0,
    "lifetime_spent" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coin_transactions" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "CoinTransactionType" NOT NULL,
    "source" "CoinSource" NOT NULL,
    "description" TEXT,
    "order_id" TEXT,
    "review_id" TEXT,
    "product_id" TEXT,
    "balance_after" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coin_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_images" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_votes" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "vote_type" "VoteType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "coin_transactions_wallet_id_idx" ON "coin_transactions"("wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_votes_review_id_user_id_key" ON "review_votes"("review_id", "user_id");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_videos" ADD CONSTRAINT "product_videos_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coin_transactions" ADD CONSTRAINT "coin_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_images" ADD CONSTRAINT "review_images_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
