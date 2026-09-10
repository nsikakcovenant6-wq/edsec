-- EDSEC certificate verification
CREATE TYPE "CertificateStatus" AS ENUM ('VALID', 'REVOKED');

CREATE TABLE "Certificate" (
  "id" TEXT NOT NULL,
  "certificateId" TEXT NOT NULL,
  "enrollmentId" TEXT NOT NULL,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status" "CertificateStatus" NOT NULL DEFAULT 'VALID',
  "revokedAt" TIMESTAMP(3),
  "revocationReason" TEXT,
  CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Certificate_certificateId_key" UNIQUE ("certificateId"),
  CONSTRAINT "Certificate_enrollmentId_key" UNIQUE ("enrollmentId"),
  CONSTRAINT "Certificate_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Certificate_status_idx" ON "Certificate"("status");
CREATE INDEX "Certificate_issuedAt_idx" ON "Certificate"("issuedAt");
