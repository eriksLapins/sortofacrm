import { prisma } from '@db';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export default defineCachedEventHandler(async (event) => {
  const body: User = await readBody(event);

  const errors: Record<string, Record<string, string>> = {};

  if (!body.clientId) {
    errors.client = { text: 'Please register your company first' };
  }

  if (!body.email) {
    errors.email = { text: 'Please enter an email' };
  }

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

  if (!body.password) {
    errors.password = { text: 'Please enter a password' };
  }

  if (typeof body.password !== 'string') {
    if (!errors.password.text) {
      errors.password = { text: 'Please enter a valid password' };
    }
  }

  if (!body.name) {
    errors.name = { text: 'Please enter your name' };
  }

  if (typeof body.name !== 'string') {
    if (!errors.name.text) {
      errors.name = { text: 'Please enter a valid name' };
    }
  }

  if (!body.lastname) {
    errors.lastname = { text: 'Please enter your lastname' };
  }

  if (typeof body.lastname !== 'string') {
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password!, salt);

    try {
      const data = await prisma.user.create({
        data: {
          ...body,
          password: hashedPassword
        }
      });

      return {
        data: data.email
      };
    } catch (e) {
      throw createError({
        status: 500,
        statusMessage: 'Something went wrong, please try again',
        message: 'unhandled error at users create'
      });
    }
  }
});
