import { prisma } from '@db';
import { ResponseError } from '~/types';

export default defineEventHandler(async (event) => {
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
      module: moduleData,
      fields,
      items,
      permissions,
      itemPermissions,
      preferences
    }
  };
});
