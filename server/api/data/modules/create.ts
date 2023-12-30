import { ModuleFields } from '@prisma/client';
import { prisma } from '@db';
import { ResponseError } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const errors: ResponseError = {};

  if (!body.module) {
    errors.data = { name: 'Please provide a name for the module' };
    throw createError({
      status: 400,
      data: {
        errors
      }
    });
  }

  try {
    prisma.modules.create({
      data: {
        name: body.module
      }
    });
  } catch (e) {
    console.log(e);
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at modules create'
    });
  }

  if (Object.keys(body.fields).length) {
    const mappedFields: ModuleFields[] = body.fields.map((field: Omit<ModuleFields, 'id'>) => {
      return {
        module: body.module,
        key: field.key,
        title: field.title,
        type: field.type,
        required: field.required
      };
    });
    try {
      prisma.moduleFields.createMany({
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
