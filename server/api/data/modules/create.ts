import { ResponseError } from '~/types';
import { error400, error500 } from '~/utils/errorThrows';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{success: boolean} | Error> => {
    const body = await readBody(event);

    const errors: ResponseError = {};

    if (!body.name) {
        errors.data = { name: 'Please provide a name for the module' };
        error400(errors);
    }

    if (!body.key) {
        errors.data = { key: 'Please provide a key for the module' };
        error400(errors);
    }

    const exists = await prisma.modules.findUnique({
        where: {
            key: body.key
        }
    });

    if (exists) {
        errors.data = { key: 'duplicate key: such a module already exists' };
        error400(errors);
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
        error500('unhandled error at modules create');
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
                error400(e.data.data.errors);
            }

            if (e.status === 500) {
                error500(e.data.message);
            }
            error500('unhandled error at modules create - fields');
        }
    }

    return { success: true };
});
