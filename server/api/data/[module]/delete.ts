import { prisma } from '../../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.clientId) {
    throw createError({
      status: 401,
      statusMessage: 'Please log in again before changing the task'
    });
  }

  if (!body.id) {
    throw createError({
      status: 400,
      statusMessage: 'Please provide a task id'
    });
  }

  try {
    await prisma.tasks.delete({
      where: {
        clientId: body.clientId,
        id: body.id
      }
    });
  } catch (e) {
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at tasks delete'
    });
  }
});
