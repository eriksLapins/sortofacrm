import { ModuleFields } from '@prisma/client';
import { prisma } from '@db';
import { ResponseError } from '~/types';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
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
        const filteredFields: Omit<ModuleFields, 'id'>[] = [];
        body.fields.forEach((field: Omit<ModuleFields, 'id'>) => {
            if (Object.keys(EFieldTypes).includes(field.type)) {
                filteredFields.push(field);
            } else {
                errors.data.fields.push({
                    [`${field.key}`]: `${field.type} not recognized as a field type`
                });
            }
        });

        const mappedFields: Omit<ModuleFields, 'id'>[] = filteredFields.map((field: Omit<ModuleFields, 'id'>) => {
            return {
                module,
                key: field.key,
                title: field.title,
                type: field.type,
                required: field.required
            };
        });
        try {
            await prisma.moduleFields.createMany({
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
