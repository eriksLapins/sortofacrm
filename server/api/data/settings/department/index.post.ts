import { prisma } from '~/server/api/db';
import { ResponseError } from '~/types';
import { error400, error500 } from '~/utils/errorThrows';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const errors: ResponseError = {};

    if (!body.name) {
        errors.data = { name: 'Please provide a name for the department' };
    }

    const existsName = await prisma.department.findFirst({
        where: {
            name: body.name
        }
    });

    if (existsName) {
        errors.data = { name: 'Name already exists' };
        error400(errors);
    }

    try {
        await prisma.department.create({
            data: {
                name: body.name
            }
        });
    } catch {
        error500('Something went wrong at department create');
    }

    return { success: true };
});
