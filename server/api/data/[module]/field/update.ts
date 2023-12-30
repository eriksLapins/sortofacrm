import { prisma } from '@db';

export default defineEventHandler(async (event) => {
    const module = getRouterParam(event, 'module');
    const body = await readBody(event);

    if (!module) {
        throw createError({
            status: 400,
            statusText: 'No module name given',
            message: 'No module name given'
        });
    }

    if (!body.field_key) {
        throw createError({
            status: 400,
            statusText: 'No field provided',
            message: 'No field provided'
        });
    }

    const currentField = await prisma.moduleFields.findUnique({
        where: {
            module_key: {
                module,
                key: body.field_key
            }
        }
    });

    if (currentField) {
        try {
            await prisma.moduleFields.update({
                where: {
                    module_key: {
                        module,
                        key: body.field_key
                    }
                },
                data: {
                    key: body.key || currentField.key,
                    module: body.module || currentField.module,
                    required: body.required || currentField.required,
                    title: body.title || currentField.title,
                    type: body.type || currentField.type
                }
            });
        } catch (e) {
            console.log(e);
            throw createError({
                status: 500,
                statusText: 'Something went wrong, please try again later',
                message: `No such field with the key ${body.key} in module ${module} exists`
            });
        }
    }
});
