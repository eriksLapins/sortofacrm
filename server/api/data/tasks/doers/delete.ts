import { prisma } from '@db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.clientId) {
    throw createError({
      status: 401,
      statusMessage: 'Please log in again before changing the task'
    });
  }

  if (!body.taskId) {
    throw createError({
      status: 400,
      statusMessage: 'Please provide a task id'
    });
  }

  const doers = await prisma.taskDoers.deleteMany({
    where: {
      clientId: body.clientId,
      taskId: body.taskId,
      doerId: {
        in: body.doerId
      }
    }
  }).catch(() => {
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at taskdoers create'
    });
  });

  return { data: doers };
});
