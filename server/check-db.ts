import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const tasks = await prisma.task.findMany({
    include: { project: true }
  });
  console.log('Total tasks in DB:', tasks.length);
  tasks.forEach(t => {
    console.log(`- ${t.title} (${t.status}) in Project: ${t.project.name}`);
  });
  process.exit(0);
}

check();
