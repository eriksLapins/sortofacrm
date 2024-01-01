import { FieldPermissions, ItemPermissions, ModuleFields, ModuleItems, Modules, Permissions, UserPreferences } from '@prisma/client';
import { ResponseError } from '~/types';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{data: {
    module: Modules,
    fields: ModuleFields[],
    items: ModuleItems,
    permissions: Permissions[],
    itemPermissions: ItemPermissions[],
    fieldPermissions: FieldPermissions[],
    preferences: UserPreferences[]

}}> => {
    const { module } = await readBody(event);
    const errors: ResponseError = {};

    if (!module) {
        errors.data = { name: 'Please provide a name for the module' };
        throw createError({
            status: 400,
            data: {
                errors
            }
        });
    }

    const moduleData = await prisma.modules.delete({
        where: {
            name: module
        }
    }).catch((e) => {
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at module delete'
        });
    });

    const fields = await prisma.moduleFields.deleteMany({
        where: {
            module
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { fields: 'Failed to delete module fields' };
    });

    const items = await prisma.moduleItems.deleteMany({
        where: {
            module
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { items: 'Failed to delete module items' };
    });

    const preferences = await prisma.userPreferences.deleteMany({
        where: {
            module
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { preferences: 'Failed to delete module preferences' };
    });

    const permissions = await prisma.permissions.deleteMany({
        where: {
            module
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { permissions: 'Failed to delete module permissions' };
    });

    const itemPermissions = await prisma.itemPermissions.deleteMany({
        where: {
            module
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { itemPermissions: 'Failed to delete module itemPermissions' };
    });

    const fieldPermissions = await prisma.fieldPermissions.deleteMany({
        where: {
            module
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { fieldPermissions: 'Failed to delete module fieldPermissions' };
    });

    if (errors.data && Object.keys(errors.data).length) {
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at module delete',
            data: {
                errors
            }
        });
    }

    return {
        data: {
            // TODO Prisma.BatchPayload -> Actual Types
            module: moduleData,
            // @ts-ignore
            fields,
            // @ts-ignore
            items,
            // @ts-ignore
            permissions,
            // @ts-ignore
            itemPermissions,
            // @ts-ignore
            fieldPermissions,
            // @ts-ignore
            preferences
        }
    };
});
