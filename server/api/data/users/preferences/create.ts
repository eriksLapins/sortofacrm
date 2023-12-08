import type { EPreferenceTypes, Prisma, UserPreferences } from '@prisma/client';
import { prisma } from '~/server/api/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.clientId) {
    throw createError({
      status: 401,
      statusMessage: 'Please log in again before changing the task'
    });
  }

  if (!body.userId) {
    throw createError({
      status: 400,
      statusMessage: 'Please provide a user id'
    });
  }

  const bodies: UserPreferences[] = body.preferences.map((preference: Prisma.JsonObject) => {
    return {
      clientId: body.clientId as number,
      userId: body.userId as string,
      module: body.module as string,
      preferenceType: body.preferenceType as EPreferenceTypes,
      preferences: preference
    };
  });

  const preferences = await prisma.userPreferences.createMany({
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

  return { data: preferences };
});
