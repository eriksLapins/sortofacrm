import { EFieldType, EFieldValueType } from '@prisma/client';
import { ResponseError } from '~/types';
import { error400, error500 } from '~/utils/errorThrows';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{success: boolean} | Error> => {
    const module = getRouterParam(event, 'module');
    const body = await readBody(event);

    const errors: ResponseError = {
        data: {
            fields: {}
        }
    };

    if (!module) {
        throw createError({
            status: 400,
            statusText: 'No module name given',
            message: 'No module name given'
        });
    }

    if (!body.id) {
        throw createError({
            status: 400,
            statusText: 'No field provided',
            message: 'No field provided'
        });
    }

    const currentField = await prisma.moduleFields.findUnique({
        where: {
            id: body.id
        }
    });

    if (currentField) {
        const bodyType = body.type || currentField.type;
        const bodyValueType = body.valueType || currentField.valueType;
        if (!Object.keys(EFieldType).includes(bodyType)) {
            errors.data.fields[body.key] = {
                ...errors.data.fields[body.key],
                type: `${bodyType} not recognized as a field type`
            };
        }
        if (!Object.keys(EFieldValueType).includes(bodyValueType)) {
            errors.data.fields[body.key] = {
                ...errors.data.fields[body.key],
                valueType: `${body.valueType} not recognized as a field value type`
            };
        }

        if (Object.keys(errors.data.fields).length) {
            error400(errors);
        }
        try {
            await prisma.moduleFields.update({
                where: {
                    id: body.id
                },
                data: {
                    key: body.key || currentField.key,
                    module: body.module || currentField.module,
                    required: body.required || currentField.required,
                    title: body.title || currentField.title,
                    type: bodyType,
                    valueType: bodyValueType,
                    additional: body.additional || currentField.additional
                }
            });
        } catch (e) {
            console.log(e);
            error500(`No such field with the id ${body.id} exists`);
        }

        if (body.key && body.key !== currentField.key) {
            try {
                await prisma.fieldPermissions.updateMany({
                    where: {
                        fieldKey: currentField.key
                    },
                    data: {
                        fieldKey: body.key
                    }
                });
            } catch (e) {
                console.log(e);
                error500('something went wrong at module fields update field permissions');
            }
        }
    }

    return { success: true };
});
