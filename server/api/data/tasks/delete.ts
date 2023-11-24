import { prisma } from '../../db';
import { useUserStore } from '~/store/userStore';

export default defineEventHandler(async (event) => {
  const clientId = useUserStore().companyId;
  const taskId = getRouterParam(event, 'id');

  try {
    await prisma.tasks.delete({
      where: {
        clientId,
        id: taskId
      }
    });
  } catch (e) {
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later'
    });
  }
});
