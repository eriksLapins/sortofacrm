import { prisma } from '../../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const errors: Record<string, Record<string, string>> = {};

  if (!body.title) {
    errors.form = { title: 'Title is required' };
  }

  if (errors) {
    throw createError({
      status: 400,
      data: {
        errors
      }
    });
  }

  try {
    const created = await prisma.tasks.create({
      data: {
        ...body
      }
    });

    return { created };
  } catch (e) {
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at tasks create'
    });
  }
});
