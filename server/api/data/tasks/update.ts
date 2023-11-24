import { prisma } from '../../db';
import { useUserStore } from '~/store/userStore';

export default defineEventHandler(async (event) => {
  const clientId = useUserStore().companyId;

  if (!clientId) {
    throw createError({
      status: 401,
      statusMessage: 'Please log in again before changing the task'
    });
  }
  const taskId = getRouterParam(event, 'id');

  if (!taskId) {
    throw createError({
      status: 400,
      statusMessage: 'Please provide a task id'
    });
  }
  const params = getRouterParams(event);

  try {
    const task = await prisma.tasks.findFirst({
      where: {
        clientId,
        id: taskId
      }
    });

    try {
      await prisma.tasks.update({
        where: {
          clientId,
          id: taskId
        },
        data: {
          clientId: clientId as number,
          createdById: task?.createdById,
          title: params.title ? params.title : task?.title,
          updatedOn: Date.now().toLocaleString('lv'),
          dueDate: params.dueDate ? params.dueDate : task?.dueDate,
          done: params.done ? !!params.done : !!task?.done,
          doneOn: params.doneOn ? params.doneOn : task?.doneOn,
          managerId: params.managerId ? params.managerId : task?.managerId,
          quoteId: params.quoteId ? params.quoteId : task?.quoteId,
          invoiceId: params.invoiceId ? params.invoiceId : task?.invoiceId,
          companyId: params.companyId ? params.companyId : task?.companyId,
          personId: params.personId ? params.personId : task?.personId,
          projectId: params.projectId ? params.projectId : task?.projectId,
          description: params.description ? params.description : task?.description,
          activityTypeId: params.activityTypeId ? params.activityTypeId : task?.activityTypeId
        }
      });
    } catch (e) {
      throw createError({
        status: 500,
        statusText: 'Something went wrong, please try again later'
      });
    }

    return { success: true };
  } catch (e: any) {
    if (e.status > 500 && e.status < 600) {
      throw createError({
        status: 500,
        statusMessage: 'Something went wrong, please try again'
      });
    }
    if (e.status === 404) {
      throw createError({
        status: 404,
        statusMessage: 'Task not found'
      });
    }
  }
});
