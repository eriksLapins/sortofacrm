import { prisma } from '@db';
import { ResponseError } from '~/types';

export default defineEventHandler(async (event): Promise<{success: boolean} | Error> => {
    const body = await readBody(event);
    const errors: ResponseError = {};

    if (!body.oldName) {
        errors.data = { name: 'Please provide a name for the module you would like to update' };
    }

    if (!body.newName) {
        errors.data = {
            newName: 'Please provide the new name for the module'
        };
    }

    if (errors.data.name || errors.data.newName) {
        throw createError({
            status: 400,
            data: {
                errors
            }
        });
    }

    try {
        await prisma.modules.update({
            where: {
                name: body.oldName
            },
            data: {
                name: body.newName
            }
        });
    } catch (e) {
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at module delete'
        });
    }

    await prisma.moduleFields.updateMany({
        where: {
            module: body.oldName
        },
        data: {
            module: body.newName
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { fields: 'Failed to update modulename in fields' };
    });
    await prisma.moduleItems.updateMany({
        where: {
            module: body.oldName
        },
        data: {
            module: body.newName
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { items: 'Failed to update modulename in items' };
    });
    await prisma.userPreferences.updateMany({
        where: {
            module: body.oldName
        },
        data: {
            module: body.newName
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { preferences: 'Failed to update modulename in preferences' };
    });
    await prisma.permissions.updateMany({
        where: {
            module: body.oldName
        },
        data: {
            module: body.newName
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { permissions: 'Failed to update modulename in permissions' };
    });
    await prisma.itemPermissions.updateMany({
        where: {
            module: body.oldName
        },
        data: {
            module: body.newName
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { itemPermissions: 'Failed to update modulename in itemPermissions' };
    });
    await prisma.fieldPermissions.updateMany({
        where: {
            module: body.oldName
        },
        data: {
            module: body.newName
        }
    }).catch((e) => {
        console.log(e);
        errors.data = { fieldPermissions: 'Failed to update modulename in fieldPermissions' };
    });

    if (errors.data && Object.keys(errors.data).length) {
        throw createError({
            status: 500,
            data: {
                errors
            }
        });
    }

    return { success: true };
});
