import { ResponseError } from '~/types';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{success: boolean} | Error> => {
    const body = await readBody(event);

    const errors: ResponseError = {};

    if (!body.name) {
        errors.data = { name: 'Please provide a name for the module' };
        throw createError({
            status: 400,
            data: {
                errors
            }
        });
    }

    if (!body.key) {
        errors.data = { key: 'Please provide a key for the module' };
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
                key: body.key
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
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at modules create search for duplicates'
        });
    }

    try {
        await prisma.modules.create({
            data: {
                name: body.name,
                key: body.key
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
            await $fetch(`/api/data/${body.key}/fields/create`, {
                method: 'POST',
                body: {
                    fields: body.fields
                }
            });
        } catch (e: any) {
            if (e.status === 400) {
                await $fetch('/api/data/modules/delete', {
                    method: 'POST',
                    body: {
                        module: body.key
                    }
                });
                throw createError({
                    status: 400,
                    data: {
                        errors: e.data.data.errors
                    }
                });
            }

            throw createError({
                status: 500,
                statusText: 'Something went wrong, please try again later',
                message: 'unhandled error at modules create - fields'
            });
        }
    }

    return { success: true };
});
