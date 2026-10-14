CREATE TABLE "SalesLead" (
"id" TEXT NOT NULL,
"reference" TEXT NOT NULL,
"category" TEXT NOT NULL,
"contactName" TEXT NOT NULL,
"email" TEXT NOT NULL,
"phone" TEXT NOT NULL,
"organization" TEXT NOT NULL,
"country" TEXT,
"requirements" TEXT NOT NULL,
"meetingMode" TEXT,
"meetingLocation" TEXT,
"preferredDate" TEXT,
"preferredTime" TEXT,
"timezone" TEXT,
"status" TEXT NOT NULL DEFAULT 'NEW',
"adminNotes" TEXT,
"quotationAmount" DOUBLE PRECISION,
"nextFollowUpAt" TIMESTAMP(3),
"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
"updatedAt" TIMESTAMP(3) NOT NULL,
CONSTRAINT "SalesLead_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SalesLead_reference_key" ON "SalesLead"("reference");
CREATE INDEX "SalesLead_status_idx" ON "SalesLead"("status");
CREATE INDEX "SalesLead_createdAt_idx" ON "SalesLead"("createdAt");
