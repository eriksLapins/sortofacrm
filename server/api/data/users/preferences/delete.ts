import { prisma } from '@db';

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

  if (!body.id) {
    throw createError({
      status: 400,
      statusMessage: 'Please provide a preference id',
      data: {
        id: { text: 'preference id is missing' }
      }
    });
  }

  try {
    const data = await prisma.userPreferences.delete({
      where: {
        userId: body.userId,
        id: body.id,
        module: body.module,
        preferences: body.preferences,
        preferenceType: body.preferenceType
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
