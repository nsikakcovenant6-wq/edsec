CREATE TABLE "ServiceOffering" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "features" TEXT NOT NULL DEFAULT '',
  "imageUrl" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ServiceOffering_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ServiceOffering_isPublished_displayOrder_idx" ON "ServiceOffering"("isPublished", "displayOrder");
