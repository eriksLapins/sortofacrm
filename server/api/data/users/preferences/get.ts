import { prisma } from '~db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.userId) {
    throw createError({
      status: 400,
      statusMessage: 'Please provide a user',
      data: {
        user: { text: 'user id is missing' }
      }
    });
  }

  try {
    const data = await prisma.userPreferences.findMany({
      where: {
        module: body.module,
        userId: body.userId
      }
    });

    return { data };
  } catch (e) {
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at preferences get'
    });
  }
});
