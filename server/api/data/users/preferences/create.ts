import type { Prisma, UserPreferences } from '@prisma/client';
import { prisma } from '@db';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body.userId) {
        throw createError({
            status: 400,
            statusMessage: 'Please provide a user id'
        });
    }

    try {
        await prisma.userPreferences.deleteMany({
            where: {
                userId: body.userId,
                module: body.module,
                preferenceType: body.preferenceType
            }
        });
    } catch (e) {
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at clearing preferences'
        });
    }

    const bodies: UserPreferences[] = body.preferences.map((preference: Prisma.JsonObject) => {
        return {
            userId: body.userId,
            module: body.module,
            preferenceType: body.preferenceType,
            preferences: preference
        };
    });

    await prisma.userPreferences.createMany({
    // @ts-ignore
        data: bodies
    }).catch((e) => {
        console.log(e);
        throw createError({
            status: 500,
            statusText: 'Something went wrong, please try again later',
            message: 'unhandled error at preferences create'
        });
    });

    return { success: true };
});
