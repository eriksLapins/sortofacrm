import { prisma } from '../../db';
import { useUserStore } from '~/store/userStore';

export default defineEventHandler(async (event) => {
  const companyId = useUserStore().currentCompany;
  const userId = useUserStore().currentUser.id;
  const params = getRouterParams(event);

  try {
    const created = await prisma.tasks.create({
      data: {
        clientId: companyId as number,
        createdById: userId as string,
        title: params.title as string,
        updatedOn: Date.now().toLocaleString('lv'),
        dueDate: params.dueDate,
        done: !!params.done,
        doneOn: params.doneOn,
        managerId: params.managerId,
        quoteId: params.quoteId,
        invoiceId: params.invoiceId,
        companyId: params.companyId,
        personId: params.personId,
        projectId: params.projectId,
        description: params.description,
        activityTypeId: params.activityTypeId
      }
    });

    return { created };
  } catch (e) {
    throw createError({
      status: 500,
      statusMessage: 'Something went wrong, please try again later'
    });
  }
});
