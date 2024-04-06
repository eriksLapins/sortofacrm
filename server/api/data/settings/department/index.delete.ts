import { prisma } from '~/server/api/db';
import { ResponseError } from '~/types';
import { error400, error500 } from '~/utils/errorThrows';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const errors: ResponseError = {};

    if (!body.id) {
        errors.data = { id: 'No id provided' };
        error400(errors);
    }

    try {
        await prisma.department.delete({
            where: {
                id: body.id
            }
        });
    } catch {
        error500('Something went wrong at department delete');
    }

    return {
        success: true
    };
});
