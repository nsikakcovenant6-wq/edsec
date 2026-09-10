import { randomUUID } from "node:crypto";
import { prisma } from "@/app/lib/prisma";

export type CertificateVerification = {
  certificateId: string;
  status: "VALID" | "REVOKED";
  studentName: string;
  courseName: string;
  issuedAt: Date;
  revokedAt: Date | null;
  revocationReason: string | null;
};

type EnrollmentRow = { id: string; studentName: string; courseName: string; status: string };

function certificateCode(year: number) {
  return `EDSEC-${year}-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function listCertificateEligibleEnrollments() {
  return prisma.$queryRaw<EnrollmentRow[]>`
    SELECT e."id", CONCAT(u."firstName", ' ', u."lastName") AS "studentName", c."title" AS "courseName", e."status"
    FROM "Enrollment" e
    INNER JOIN "User" u ON u."id" = e."studentId"
    INNER JOIN "Course" c ON c."id" = e."courseId"
    LEFT JOIN "Certificate" cert ON cert."enrollmentId" = e."id"
    WHERE e."status" = 'COMPLETED' AND cert."id" IS NULL
    ORDER BY e."completedAt" DESC NULLS LAST, e."updatedAt" DESC
  `;
}

export async function listCertificates() {
  return prisma.$queryRaw<CertificateVerification[]>`
    SELECT cert."certificateId", cert."status", CONCAT(u."firstName", ' ', u."lastName") AS "studentName",
           c."title" AS "courseName", cert."issuedAt", cert."revokedAt", cert."revocationReason"
    FROM "Certificate" cert
    INNER JOIN "Enrollment" e ON e."id" = cert."enrollmentId"
    INNER JOIN "User" u ON u."id" = e."studentId"
    INNER JOIN "Course" c ON c."id" = e."courseId"
    ORDER BY cert."issuedAt" DESC
    LIMIT 100
  `;
}

export async function issueCertificate(enrollmentId: string) {
  const rows = await prisma.$queryRaw<EnrollmentRow[]>`
    SELECT e."id", CONCAT(u."firstName", ' ', u."lastName") AS "studentName", c."title" AS "courseName", e."status"
    FROM "Enrollment" e
    INNER JOIN "User" u ON u."id" = e."studentId"
    INNER JOIN "Course" c ON c."id" = e."courseId"
    WHERE e."id" = ${enrollmentId}
    LIMIT 1
  `;
  const enrollment = rows[0];
  if (!enrollment) throw new Error("Enrollment not found.");
  if (enrollment.status !== "COMPLETED") throw new Error("A certificate can only be issued for a completed enrollment.");

  const existing = await prisma.$queryRaw<{ certificateId: string }[]>`
    SELECT "certificateId" FROM "Certificate" WHERE "enrollmentId" = ${enrollmentId} LIMIT 1
  `;
  if (existing[0]) return existing[0].certificateId;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const certificateId = certificateCode(new Date().getFullYear());
    try {
      await prisma.$executeRaw`
        INSERT INTO "Certificate" ("id", "certificateId", "enrollmentId", "issuedAt", "status")
        VALUES (${randomUUID()}, ${certificateId}, ${enrollmentId}, NOW(), 'VALID')
      `;
      return certificateId;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }
  throw new Error("Could not issue certificate.");
}

export async function verifyCertificate(certificateId: string) {
  const normalized = certificateId.trim().toUpperCase();
  if (!normalized) return null;
  const rows = await prisma.$queryRaw<CertificateVerification[]>`
    SELECT cert."certificateId", cert."status", CONCAT(u."firstName", ' ', u."lastName") AS "studentName",
           c."title" AS "courseName", cert."issuedAt", cert."revokedAt", cert."revocationReason"
    FROM "Certificate" cert
    INNER JOIN "Enrollment" e ON e."id" = cert."enrollmentId"
    INNER JOIN "User" u ON u."id" = e."studentId"
    INNER JOIN "Course" c ON c."id" = e."courseId"
    WHERE cert."certificateId" = ${normalized}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function revokeCertificate(certificateId: string, reason: string) {
  await prisma.$executeRaw`
    UPDATE "Certificate"
    SET "status" = 'REVOKED', "revokedAt" = NOW(), "revocationReason" = ${reason || null}
    WHERE "certificateId" = ${certificateId.trim().toUpperCase()}
  `;
}
