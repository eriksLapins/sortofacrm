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

  const errors: Record<string, Record<string, string>> = {};

  if (!body.title) {
    errors.form = { title: 'Title is required' };
  }

  if (Object.keys(errors).length) {
    throw createError({
      status: 400,
      data: {
        errors
      }
    });
  }

  try {
    const task = await prisma.tasks.update({
      where: {
        clientId: body.clientId,
        id: body.id
      },
      data: {
        ...body
      }
    });

    return { data: task };
  } catch (e) {
    console.log(e);
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later'
    });
  }
});
