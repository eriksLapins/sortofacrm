import { prisma } from '../../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

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
      statusText: 'Something went wrong, please try again later'
    });
  }
});
