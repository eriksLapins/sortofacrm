import { prisma } from '../../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const tasks = await prisma.tasks.findMany({
    where: {
      ...body
    }
  });

  return { data: tasks };
});
