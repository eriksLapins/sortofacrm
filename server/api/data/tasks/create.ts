import { prisma } from '../../db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log(body.clientId);

  try {
    const created = await prisma.tasks.create({
      data: {
        clientId: body.clientId,
        createdById: body.userId,
        title: body.title,
        dueDate: new Date(body.dueDate),
        done: body.done,
        doneOn: new Date(body.doneOn),
        managerId: body.managerId,
        quoteId: body.quoteId,
        invoiceId: body.invoiceId,
        companyId: body.companyId,
        personId: body.personId,
        projectId: body.projectId,
        description: body.description,
        activityTypeId: body.activityTypeId
      }
    });

    return { created };
  } catch (e) {
    console.log(e);
    throw createError({
      status: 500,
      statusMessage: 'Something went wrong, please try again later'
    });
  }
});
