import { prisma } from '@db';
import { ModuleFields } from '@prisma/client';
import { ResponseError } from '~/types';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const module = getRouterParam(event, 'module');

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

  if (Object.keys(body.fields).length) {
    const mappedFields: ModuleFields[] = body.fields.map((field: Omit<ModuleFields, 'id'>) => {
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