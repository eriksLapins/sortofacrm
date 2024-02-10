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

    if (!body.newName) {
        errors.data = { name: 'Please provide a new name' };
        error400(errors);
    }

    if (body.newName.length < 3) {
        errors.data = { name: 'Please provide a name longer than 3 characters' };
        error400(errors);
    }

    if (body.name !== body.newName) {
        const existsNewName = await prisma.department.findFirst({
            where: {
                name: body.newName
            }
        });

        if (existsNewName) {
            errors.data = { name: 'Such a name already exists, please provide a different one' };
            error400(errors);
        }

        try {
            await prisma.department.update({
                where: {
                    id: body.id
                },
                data: {
                    name: body.newName
                }
            });
        } catch {
            error500('Something went wrong at department update');
        }
    }

    return {
        success: true
    };
});
