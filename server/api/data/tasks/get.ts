import { prisma } from '../../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.clientId) {
    throw createError({
      status: 401,
      statusMessage: 'Please log in again before changing the task'
    });
  }

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
