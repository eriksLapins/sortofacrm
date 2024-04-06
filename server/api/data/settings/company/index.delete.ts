import { prisma } from '~/server/api/db';
import { error500 } from '~/utils/errorThrows';

export default defineEventHandler(async (event) => {
    const { id } = await readBody(event);

    if (!id) {
        throw createError({
            status: 400,
            message: 'Please provide an ID for the company'
        });
    }

    try {
        await prisma.clientCompany.delete({
            where: {
                id
            }
        });
    } catch {
        error500('Something went wrong at client company delete');
    }
});
