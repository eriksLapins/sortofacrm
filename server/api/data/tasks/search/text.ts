import { prisma } from '@db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const query = getQuery(event);

  if (!body.clientId) {
    throw createError({
      status: 401,
      statusMessage: 'Please log in again before changing the task'
    });
  };

  try {
    const data = await prisma.tasks.findMany({
      where: {
        AND: [
          {
            clientId: body.clientId
          },
          {
            OR: [
              {
                title: {
                  contains: query.searchQuery as string
                }
              },
              {
                description: {
                  contains: query.searchQuery as string
                }
              }
            ]
          }
        ]
      }
    });

    return { data };
  } catch (e) {
    console.log(e);
  }
});
