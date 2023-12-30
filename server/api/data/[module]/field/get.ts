import { ModuleFields } from '@prisma/client';
import { prisma } from '@db';

export default defineEventHandler(async (event): Promise<{data: ModuleFields[]}> => {
  const module = getRouterParam(event, 'module');
  if (!module) {
    throw createError({
      status: 400,
      statusText: 'No module name given',
      message: 'No module name given'
    });
  }
  try {
    const moduleFields = await prisma.moduleFields.findMany({
      where: {
        module
      }
    });

    return {
      data: moduleFields
    };
  } catch (e) {
    console.log(e);
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'could not get module fields'
    });
  }
});
