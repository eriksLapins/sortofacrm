import { prisma } from '@db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const tasks = await prisma.tasks.findMany({
      where: {
        ...body
      }
    });

    return {
      data: {
        tasks
      }
    };
  } catch (e) {
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at tasks get'
    });
  }
});
