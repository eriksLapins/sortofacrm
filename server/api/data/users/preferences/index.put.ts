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

  if (!body.id) {
    throw createError({
      status: 400,
      statusMessage: 'Please provide a preference',
      data: {
        id: { text: 'preference id is missing' }
      }
    });
  }

  try {
    const existingPreferences = await prisma.userPreferences.findMany({
      where: {
        userId: body.userId,
        module: body.module
      }
    });
  } catch (e) {
    console.log(e);
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at preferences get in preferences update'
    });
  }

  try {
    const data = await prisma.userPreferences.update({
      where: {
        id: body.id,
        userId: body.userId,
        module: body.module
      },
      data: {
        ...body
      }
    });

    return { data };
  } catch (e) {
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at preferences update'
    });
  }
});
