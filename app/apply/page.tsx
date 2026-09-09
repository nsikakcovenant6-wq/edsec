import { prisma } from "@/app/lib/prisma";
import ApplyForm from "./ApplyForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Apply to EDSEC",
  description:
    "Apply to EDSEC and start building practical technology skills.",
};

export default async function ApplyPage() {
  const courses = await prisma.course.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
  });

  return <ApplyForm courses={courses} />;
}