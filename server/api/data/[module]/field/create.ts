import { ModuleFields } from '@prisma/client';
import { ResponseError } from '~/types';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{success: boolean} | Error> => {
    const body: {fields: Omit<ModuleFields, 'id'>[]} = await readBody(event);
    const module = getRouterParam(event, 'module');

    const errors: ResponseError = {
        data: {
            fields: []
        }
    };

    if (!module) {
        errors.data = { name: 'Please provide a name for the module' };
        throw createError({
            status: 400,
            data: {
                errors
            }
        });
    }

    if (Object.keys(body.fields).length) {
        const filteredFields: typeof body.fields = [];
        body.fields.forEach((field) => {
            if (!Object.keys(EFieldValueType).includes(field.type)) {
                errors.data.fields.push({
                    [`${field.key}`]: `${field.type} not recognized as a field type`
                });
            }
            if (!Object.keys(EFieldType).includes(field.valueType)) {
                errors.data.fields.push({
                    [`${field.key}`]: `${field.valueType} not recognized as a field value type`
                });
            }
            filteredFields.push(field);
        });

        if (errors.data.fields.length) {
            throw createError({
                status: 400,
                data: {
                    errors
                }
            });
        }

        const mappedFields: typeof body.fields = filteredFields.map((field) => {
            return {
                module,
                key: field.key,
                title: field.title,
                type: field.type,
                required: field.required,
                valueType: field.valueType,
                additional: field.additional
            };
        });
        try {
            await prisma.moduleFields.createMany({
                // @ts-ignore
                data: mappedFields
            });
        } catch (e) {
            console.log(e);
            throw createError({
                status: 500,
                statusText: 'Something went wrong, please try again later',
                message: 'unhandled error at modules create'
            });
        }
    }

    return { success: true };
});
