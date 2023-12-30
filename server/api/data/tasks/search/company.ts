import { prisma } from '@db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const companyId = getRouterParam(event, 'companyId');

  if (!body.clientId) {
    throw createError({
      status: 401,
      statusMessage: 'Please log in again before changing the task'
    });
  };

  const data = await prisma.tasks.findMany({
    where: {
      clientId: body.clientId,
      companyId
    }
  });

  return { data };
});
