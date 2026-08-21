-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MANUAL', 'PAYSTACK', 'FLUTTERWAVE', 'BANK_TRANSFER', 'CASH');

-- CreateEnum
CREATE TYPE "CohortStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "LiveClassStatus" AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('TEST', 'PROJECT', 'ASSIGNMENT', 'EXAM', 'PRACTICAL');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('LESSON_COMPLETED', 'TEST_COMPLETED', 'PROJECT_SUBMITTED', 'LIVE_CLASS_ATTENDED', 'ACHIEVEMENT_EARNED', 'PAYMENT_MADE', 'COURSE_ENROLLED', 'LOGIN');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PENDING', 'SUBMITTED', 'GRADED', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "cohortId" TEXT;

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "method" "PaymentMethod" NOT NULL DEFAULT 'MANUAL',
    "notes" TEXT,
    "paidAt" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cohort" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "CohortStatus" NOT NULL DEFAULT 'UPCOMING',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveClass" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdById" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "meetingUrl" TEXT NOT NULL,
    "status" "LiveClassStatus" NOT NULL DEFAULT 'SCHEDULED',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiveClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveClassEnrollment" (
    "id" TEXT NOT NULL,
    "liveClassId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveClassEnrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "liveClassId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "joinedAt" TIMESTAMP(3),
    "leftAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "AssessmentType" NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "dueDate" TIMESTAMP(3),
    "status" "AssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grade" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL,
    "grade" TEXT,
    "feedback" TEXT,
    "gradedById" TEXT,
    "gradedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAchievement" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentActivity" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "enrollmentId" TEXT,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentProjectRecord" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "projectId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "score" DOUBLE PRECISION,
    "feedback" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3),
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProjectRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

-- CreateIndex
CREATE INDEX "Payment_studentId_idx" ON "Payment"("studentId");

-- CreateIndex
CREATE INDEX "Payment_enrollmentId_idx" ON "Payment"("enrollmentId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE INDEX "Cohort_courseId_idx" ON "Cohort"("courseId");

-- CreateIndex
CREATE INDEX "Cohort_status_idx" ON "Cohort"("status");

-- CreateIndex
CREATE INDEX "Cohort_startDate_idx" ON "Cohort"("startDate");

-- CreateIndex
CREATE INDEX "LiveClass_courseId_idx" ON "LiveClass"("courseId");

-- CreateIndex
CREATE INDEX "LiveClass_scheduledAt_idx" ON "LiveClass"("scheduledAt");

-- CreateIndex
CREATE INDEX "LiveClass_status_idx" ON "LiveClass"("status");

-- CreateIndex
CREATE INDEX "LiveClass_isPublished_idx" ON "LiveClass"("isPublished");

-- CreateIndex
CREATE INDEX "LiveClassEnrollment_liveClassId_idx" ON "LiveClassEnrollment"("liveClassId");

-- CreateIndex
CREATE INDEX "LiveClassEnrollment_enrollmentId_idx" ON "LiveClassEnrollment"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "LiveClassEnrollment_liveClassId_enrollmentId_key" ON "LiveClassEnrollment"("liveClassId", "enrollmentId");

-- CreateIndex
CREATE INDEX "Attendance_liveClassId_idx" ON "Attendance"("liveClassId");

-- CreateIndex
CREATE INDEX "Attendance_studentId_idx" ON "Attendance"("studentId");

-- CreateIndex
CREATE INDEX "Attendance_status_idx" ON "Attendance"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_liveClassId_studentId_key" ON "Attendance"("liveClassId", "studentId");

-- CreateIndex
CREATE INDEX "Assessment_courseId_idx" ON "Assessment"("courseId");

-- CreateIndex
CREATE INDEX "Assessment_type_idx" ON "Assessment"("type");

-- CreateIndex
CREATE INDEX "Assessment_status_idx" ON "Assessment"("status");

-- CreateIndex
CREATE INDEX "Grade_studentId_idx" ON "Grade"("studentId");

-- CreateIndex
CREATE INDEX "Grade_assessmentId_idx" ON "Grade"("assessmentId");

-- CreateIndex
CREATE INDEX "Grade_enrollmentId_idx" ON "Grade"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Grade_studentId_assessmentId_key" ON "Grade"("studentId", "assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_name_key" ON "Achievement"("name");

-- CreateIndex
CREATE INDEX "StudentAchievement_studentId_idx" ON "StudentAchievement"("studentId");

-- CreateIndex
CREATE INDEX "StudentAchievement_achievementId_idx" ON "StudentAchievement"("achievementId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAchievement_studentId_achievementId_key" ON "StudentAchievement"("studentId", "achievementId");

-- CreateIndex
CREATE INDEX "StudentActivity_studentId_idx" ON "StudentActivity"("studentId");

-- CreateIndex
CREATE INDEX "StudentActivity_enrollmentId_idx" ON "StudentActivity"("enrollmentId");

-- CreateIndex
CREATE INDEX "StudentActivity_type_idx" ON "StudentActivity"("type");

-- CreateIndex
CREATE INDEX "StudentActivity_createdAt_idx" ON "StudentActivity"("createdAt");

-- CreateIndex
CREATE INDEX "StudentProjectRecord_studentId_idx" ON "StudentProjectRecord"("studentId");

-- CreateIndex
CREATE INDEX "StudentProjectRecord_projectId_idx" ON "StudentProjectRecord"("projectId");

-- CreateIndex
CREATE INDEX "StudentProjectRecord_status_idx" ON "StudentProjectRecord"("status");

-- CreateIndex
CREATE INDEX "Enrollment_cohortId_idx" ON "Enrollment"("cohortId");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cohort" ADD CONSTRAINT "Cohort_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cohort" ADD CONSTRAINT "Cohort_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveClass" ADD CONSTRAINT "LiveClass_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveClass" ADD CONSTRAINT "LiveClass_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveClassEnrollment" ADD CONSTRAINT "LiveClassEnrollment_liveClassId_fkey" FOREIGN KEY ("liveClassId") REFERENCES "LiveClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveClassEnrollment" ADD CONSTRAINT "LiveClassEnrollment_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_liveClassId_fkey" FOREIGN KEY ("liveClassId") REFERENCES "LiveClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_gradedById_fkey" FOREIGN KEY ("gradedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAchievement" ADD CONSTRAINT "StudentAchievement_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAchievement" ADD CONSTRAINT "StudentAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAchievement" ADD CONSTRAINT "StudentAchievement_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivity" ADD CONSTRAINT "StudentActivity_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivity" ADD CONSTRAINT "StudentActivity_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProjectRecord" ADD CONSTRAINT "StudentProjectRecord_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentProjectRecord" ADD CONSTRAINT "StudentProjectRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "StudentProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
