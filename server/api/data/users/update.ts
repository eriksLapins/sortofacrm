import { prisma } from '@db';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export default defineCachedEventHandler(async (event) => {
  const body: User = await readBody(event);

  const errors: Record<string, Record<string, string>> = {};

  let currentUser: User | null;
  try {
    currentUser = await prisma.user.findUnique({
      where: {
        clientId: body.clientId,
        id: body.id
      }
    });
  } catch (e) {
    throw createError({
      status: 500,
      statusText: 'Something went wrong, please try again later',
      message: 'unhandled error at users update find'
    });
  }

  if (body.email && body.email !== currentUser?.email) {
    errors.email = { text: 'Please enter an email' };

    if (typeof body.email !== 'string') {
      if (!errors.email.text) {
        errors.email = { text: 'Please enter a valid email' };
      }
    }

    const emailCheck: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const result: boolean = emailCheck.test(body.email);
    if (!result) {
      if (!errors.email.text) {
        errors.email = { text: 'Please enter a valid email' };
      }
    }
    const existsEmail = await prisma.user.findUnique({
      where: {
        email: body.email
      },
      select: {
        email: true
      }
    });

    if (existsEmail) {
      if (!errors.email.text) {
        errors.email = { text: 'Please enter a valid email' };
      }
    }
  }

  if (body.password && typeof body.password !== 'string') {
    if (!errors.password.text) {
      errors.password = { text: 'Please enter a valid password' };
    }
  }

  if (body.name && typeof body.name !== 'string') {
    if (!errors.name.text) {
      errors.name = { text: 'Please enter a valid name' };
    }
  }

  if (body.lastname && typeof body.lastname !== 'string') {
    if (!errors.lastname.text) {
      errors.lastname = { text: 'Please enter a valid lastname' };
    }
  }

  if (body.initials && typeof body.initials !== 'string') {
    errors.initials = { text: 'Please enter valid initials' };
  }

  if (body.phoneNumber && typeof body.phoneNumber !== 'string') {
    errors.phone = { text: 'Please enter a valid phone number' };
  }

  if (errors) {
    throw createError({
      status: 400,
      statusMessage: 'There were errors upon submission',
      data: {
        errors
      }
    });
  } else {
    let hashedPassword;
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(body.password!, salt);
    }

    try {
      const data = await prisma.user.update({
        where: {
          id: body.id,
          clientId: body.clientId
        },
        data: {
          ...body,
          password: hashedPassword || currentUser?.password
        }
      });

      return {
        data
      };
    } catch (e) {
      throw createError({
        status: 500,
        statusMessage: 'Something went wrong, please try again',
        message: 'unhandled error at users update'
      });
    }
  }
});
