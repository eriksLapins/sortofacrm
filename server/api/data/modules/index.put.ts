import { ResponseError } from '~/types';
import { error400, error500 } from '~/utils/errorThrows';
import { prisma } from '~db';

export default defineEventHandler(async (event): Promise<{success: boolean} | Error> => {
    const body = await readBody(event);
    const errors: ResponseError = {
        data: {
            fields: {}
        }
    };

    if (!body.oldName) {
        errors.data = {
            ...errors.data,
            name: 'Please provide a name for the module you would like to update'
        };
    }

    if (!body.newName) {
        errors.data = {
            ...errors.data,
            name: 'Please provide the new name for the module'
        };
    }

    if (!body.oldKey) {
        errors.data = {
            ...errors.data,
            key: 'Please provide a key for the module you would like to update'
        };
    }

    if (!body.newKey) {
        errors.data = {
            ...errors.data,
            key: 'Please provide the new key for the module'
        };
    }

    if (errors.data.name || errors.data.key) {
        error400(errors);
    }

    try {
        const existsTitle = await prisma.modules.findUnique({
            where: {
                name: body.newName
            }
        });
        if (existsTitle) {
            errors.data = {
                ...errors.data,
                name: 'A module with such a name already exists'
            };
        }
    } catch (e) {
        error500('something went wrong at modules udpdate get by title');
    }

    if (errors.data.name || errors.data.key) {
        error400(errors);
    }

    try {
        const existsKey = await prisma.modules.findFirst({
            where: {
                key: body.newKey
            }
        });
        if (existsKey) {
            errors.data = {
                ...errors.data,
                key: 'A module with such a key already exists'
            };
        }
    } catch (e) {
        error500('something went wrong at modules udpdate get by key');
    }

    try {
        await prisma.modules.update({
            where: {
                key: body.oldKey
            },
            data: {
                name: body.newName,
                key: body.newKey
            }
        });
    } catch (e) {
        console.log(e);
        error500('unhandled error at module update');
    }

    if (body.oldKey === body.newKey) {
        return { success: true };
    }

    await prisma.moduleFields.updateMany({
        where: {
            module: body.oldKey
        },
        data: {
            module: body.newKey
        }
    }).catch((e) => {
        console.log(e);
        errors.data = {
            ...errors.data,
            external: {
                fields: 'Failed to update modulename in fields'
            }
        };
    });
    await prisma.moduleItems.updateMany({
        where: {
            module: body.oldKey
        },
        data: {
            module: body.newKey
        }
    }).catch((e) => {
        console.log(e);
        errors.data = {
            ...errors.data,
            external: {
                items: 'Failed to update modulename in items'
            }
        };
    });
    await prisma.userPreferences.updateMany({
        where: {
            module: body.oldKey
        },
        data: {
            module: body.newKey
        }
    }).catch((e) => {
        console.log(e);
        errors.data = {
            ...errors.data,
            external: {
                preferences: 'Failed to update modulename in preferences'
            }
        };
    });
    await prisma.permissions.updateMany({
        where: {
            module: body.oldKey
        },
        data: {
            module: body.newKey
        }
    }).catch((e) => {
        console.log(e);
        errors.data = {
            ...errors.data,
            external: {
                permissions: 'Failed to update modulename in permissions'
            }
        };
    });
    await prisma.itemPermissions.updateMany({
        where: {
            module: body.oldKey
        },
        data: {
            module: body.newKey
        }
    }).catch((e) => {
        console.log(e);
        errors.data = {
            ...errors.data,
            external: {
                itemPermissions: 'Failed to update modulename in itemPermissions'
            }
        };
    });
    await prisma.fieldPermissions.updateMany({
        where: {
            module: body.oldKey
        },
        data: {
            module: body.newKey
        }
    }).catch((e) => {
        console.log(e);
        errors.data = {
            ...errors.data,
            external: {
                fieldPermissions: 'Failed to update modulename in fieldPermissions'
            }
        };
    });

    if (Object.keys(errors.data.external).length) {
        throw createError({
            status: 500,
            data: {
                errors
            }
        });
    }

    return { success: true };
});
