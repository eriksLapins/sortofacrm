import { ModuleFieldsAdjusted, ResponseError } from '~/types';
import { error400, error500 } from '~/utils/errorThrows';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{success: boolean} | Error> => {
    const body: {fields: ModuleFieldsAdjusted[]} = await readBody(event);
    const module = getRouterParam(event, 'module');

    const errors: ResponseError = {
        data: {
            fields: {}
        }
    };

    if (!module) {
        errors.data = { name: 'Please provide a name for the module' };
        error400(errors);
    }

    if (!Object.keys(body.fields).length) {
        errors.data = { general: 'Please provide at least one field' };
        error400(errors);
    }

    const fieldTitles = body.fields.map(field => field.title);
    const dedupedFieldTitles: string[] = [];
    for (const field in fieldTitles) {
        if (dedupedFieldTitles.includes(field)) {
            errors.data.fields[field] = { title: `title ${field} duplicated in request` };
        }
    }

    if (Object.keys(errors.data.field).length) {
        error400(errors);
    }

    for (const field in fieldTitles) {
        try {
            const exists = await prisma.moduleFields.findFirst({
                where: {
                    title: field
                }
            });

            if (exists) {
                errors.data.fields[field] = { title: `title ${field} already in database for module ${module}` };
            }
        } catch (e) {
            console.log(e);
            error500('unhandled error at module fields create find by title');
        }
    }

    if (Object.keys(errors.data.field).length) {
        error400(errors);
    }

    const fieldKeys = body.fields.map(field => field.key);
    const dedupedFieldKeys: string[] = [];
    for (const field in fieldKeys) {
        if (dedupedFieldKeys.includes(field)) {
            errors.data.fields[field] = { key: `key ${field} duplicated in request` };
        }
    }

    if (Object.keys(errors.data.field).length) {
        error400(errors);
    }

    for (const field in fieldKeys) {
        try {
            const exists = await prisma.moduleFields.findFirst({
                where: {
                    key: field
                }
            });

            if (exists) {
                errors.data.fields[field] = { key: `key ${field} already in database for module ${module}` };
            }
        } catch (e) {
            console.log(e);
            error500('unhandled error at module fields create find by key');
        }
    }

    if (Object.keys(errors.data.field).length) {
        error400(errors);
    }

    const filteredFields: ModuleFieldsAdjusted[] = [];
    body.fields.forEach((field) => {
        if (!Object.keys(EFieldValueType).includes(field.type)) {
            errors.data.fields[field.key] = {
                type: `${field.type} not recognized as a field type`
            };
        }
        if (!Object.keys(EFieldType).includes(field.valueType)) {
            errors.data.fields[field.key] = {
                valueType: `${field.valueType} not recognized as a field value type`
            };
        }
        filteredFields.push(field);
    });

    if (Object.keys(errors.data.fields).length) {
        error400(errors);
    }

    // @ts-ignore
    const mappedFields: ModuleFieldsAdjusted[] = filteredFields.map((field) => {
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
        error500('unhandled error at module fields create');
    }

    return { success: true };
});
