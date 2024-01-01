import { prisma } from '@db';
import { ResponseError } from '~/types';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const errors: ResponseError = {};

    if (!body.module) {
        errors.data = { name: 'Please provide a name for the module' };
        throw createError({
            status: 400,
            data: {
                errors
            }
        });
    }

    try {
        const exists = await prisma.modules.findUnique({
            where: {
                name: body.module
            }
        });

        if (exists) {
            errors.data = { duplicates: 'such a module already exists' };
            throw createError({
                status: 400,
                data: {
                    errors
                }
            });
        }
    } catch (e) {
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at modules create search for duplicates'
        });
    }

    try {
        prisma.modules.create({
            data: {
                name: body.module
            }
        });
    } catch (e) {
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at modules create'
        });
    }

    if (Object.keys(body.fields).length) {
        try {
            await $fetch(`/api/data/${body.module}/fields/create`, {
                method: 'POST',
                body: {
                    fields: body.fields
                }
            });
        } catch (e) {
            throw createError({
                status: 500,
                statusText: 'Something went wrong, please try again later',
                message: 'unhandled error at modules create - fields'
            });
        }
    }

    return { success: true };
});
