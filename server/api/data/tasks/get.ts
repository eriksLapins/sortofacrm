import { prisma } from '../../db';
import { useUserStore } from '~/store/userStore';

export default defineEventHandler(async (event) => {
  const companyId = useUserStore().currentCompany;
  const params = getRouterParams(event);

  const tasks = await prisma.tasks.findMany({
    where: {
      clientId: companyId,
      ...params
    }
  });

  return { tasks };
});
