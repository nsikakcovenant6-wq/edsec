import "dotenv/config";

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not defined. Check your .env file."
  );
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

const courses = [
  {
    title: "Microsoft Office Professional",
    slug: "microsoft-office-professional",
    shortDescription:
      "Master Microsoft Word, Excel, PowerPoint and essential productivity tools for school and the workplace.",
    description:
      "Build practical Microsoft Office skills for academic, professional and everyday productivity.",
    duration: "8 Weeks",
    learningFormat: "On-site / Online / Hybrid",
    requirements:
      "Basic computer literacy. No previous Microsoft Office experience required.",
    status: "ACTIVE" as const,
    featured: true,
    displayOrder: 1,
  },
  {
    title: "Graphic Design",
    slug: "graphic-design",
    shortDescription:
      "Learn how to create professional graphics, branding materials, social media designs and visual content.",
    description:
      "Develop practical graphic design skills using modern design tools and professional workflows.",
    duration: "12 Weeks",
    learningFormat: "On-site / Online / Hybrid",
    requirements:
      "Basic computer literacy. Creativity and willingness to learn are recommended.",
    status: "ACTIVE" as const,
    featured: true,
    displayOrder: 2,
  },
  {
    title: "UI/UX Design",
    slug: "ui-ux-design",
    shortDescription:
      "Learn user interface and user experience design principles and create modern digital experiences.",
    description:
      "Learn how to research users, design interfaces, create prototypes and develop practical UI/UX case studies.",
    duration: "12 Weeks",
    learningFormat: "On-site / Online / Hybrid",
    requirements:
      "Basic computer literacy. No previous UI/UX experience required.",
    status: "ACTIVE" as const,
    featured: true,
    displayOrder: 3,
  },
  {
    title: "Full-Stack Web Development",
    slug: "full-stack-web-development",
    shortDescription:
      "Learn to build modern websites and full-stack web applications from frontend to backend.",
    description:
      "Develop practical frontend and backend development skills and build real-world web applications.",
    duration: "24 Weeks",
    learningFormat: "On-site / Online / Hybrid",
    requirements:
      "Basic computer literacy. Basic mathematics and problem-solving skills are helpful.",
    status: "ACTIVE" as const,
    featured: true,
    displayOrder: 4,
  },
  {
    title: "Cybersecurity",
    slug: "cybersecurity",
    shortDescription:
      "Learn cybersecurity fundamentals, networking, system security, threats, vulnerabilities and defensive techniques.",
    description:
      "Build a strong foundation in cybersecurity and learn practical techniques for protecting systems and information.",
    duration: "16 Weeks",
    learningFormat: "On-site / Online / Hybrid",
    requirements:
      "Basic computer knowledge and an interest in cybersecurity.",
    status: "ACTIVE" as const,
    featured: true,
    displayOrder: 5,
  },
  {
    title: "Data Analysis",
    slug: "data-analysis",
    shortDescription:
      "Learn how to collect, clean, analyze and visualize data to support better decisions.",
    description:
      "Develop practical data analysis skills using spreadsheets, databases and modern data visualization techniques.",
    duration: "12 Weeks",
    learningFormat: "On-site / Online / Hybrid",
    requirements:
      "Basic computer literacy. Basic mathematics is recommended.",
    status: "ACTIVE" as const,
    featured: true,
    displayOrder: 6,
  },
  {
    title: "Digital Marketing",
    slug: "digital-marketing",
    shortDescription:
      "Learn digital marketing, social media, content strategy, advertising and online business growth.",
    description:
      "Develop practical skills for promoting businesses, products and services through digital channels.",
    duration: "10 Weeks",
    learningFormat: "On-site / Online / Hybrid",
    requirements:
      "Basic computer literacy. No previous marketing experience required.",
    status: "ACTIVE" as const,
    featured: false,
    displayOrder: 7,
  },
  {
    title: "IT Support & Networking",
    slug: "it-support-and-networking",
    shortDescription:
      "Learn computer hardware, troubleshooting, operating systems, networking and IT support fundamentals.",
    description:
      "Build practical skills for diagnosing computer problems, supporting users and managing basic networks.",
    duration: "12 Weeks",
    learningFormat: "On-site / Online / Hybrid",
    requirements:
      "Basic computer literacy. No previous IT support experience required.",
    status: "ACTIVE" as const,
    featured: true,
    displayOrder: 8,
  },
];

async function main() {
  console.log("🌱 Seeding EDSEC courses...");

  for (const course of courses) {
    const existingCourse = await prisma.course.findUnique({
      where: {
        slug: course.slug,
      },
    });

    if (existingCourse) {
      await prisma.course.update({
        where: {
          id: existingCourse.id,
        },
        data: course,
      });

      console.log(`✓ Updated: ${course.title}`);
    } else {
      await prisma.course.create({
        data: course,
      });

      console.log(`✓ Created: ${course.title}`);
    }
  }

  const totalCourses = await prisma.course.count();

  console.log("");
  console.log("✅ EDSEC course seeding completed.");
  console.log(`📚 Total courses in database: ${totalCourses}`);
}

main()
  .catch((error) => {
    console.error("❌ Course seeding failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });