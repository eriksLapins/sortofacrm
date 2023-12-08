import { prisma } from '~/server/api/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.clientId) {
    throw createError({
      status: 401,
      statusMessage: 'Please log in again before retrieving the data'
    });
  }

  if (!body.userId) {
    throw createError({
      status: 400,
      statusMessage: 'Please provide a user',
      data: {
        user: { text: 'user id is missing' }
      }
    });
  }

  if (!body.id) {
    throw createError({
      status: 400,
      statusMessage: 'Please provide a preference id',
      data: {
        user: { text: 'preference id is missing' }
      }
    });
  }

  try {
    const data = await prisma.userPreferences.delete({
      where: {
        clientId: body.clientId,
        userId: body.userId,
        id: body.id
      }
    });

    return { data };
  } catch (e) {
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at preferences delete'
    });
  }
});
