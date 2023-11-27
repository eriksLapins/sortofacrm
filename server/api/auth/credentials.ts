import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';

export default defineEventHandler(async (event): Promise<{ token: string}> => {
  const config = useRuntimeConfig(event);
  const { username, password } = await readBody(event);

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please enter a username'
    });
  }

  if (!password) {
    throw createError({
      statusCode: 400,
      statusText: 'Please enter a password'
    });
  }

  let user;

  try {
    user = await prisma.user.findUnique({
      where: {
        username
      },
      select: {
        username: true,
        password: true,
        role: true,
        clientId: true,
        id: true
      }
    });
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusText: 'Somethingg went wrong, please try again'
    });
  }

  if (!user) {
    throw createError({
      statusCode: 404,
      statusText: 'Please check if you have provided the correct info'
    });
  }

  if (!user.password) {
    throw createError({
      statusCode: 400,
      statusText: 'Please check if you have signed in with the correct account type'
    });
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    throw createError({
      statusCode: 400,
      statusText: 'Incorrect password, please try again'
    });
  }

  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
      companyId: user.clientId,
      userId: user.id
    },
    config.auth.secret,
    { expiresIn: 60 * 60 * 24 }
  );

  return { token };
});
