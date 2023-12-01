import type { Tasks } from '@prisma/client';

export type TaskDoersData = Array<{
      id: string,
      name: string,
      lastname: string,
      initials: string,
      image: string | null,
    }>;

export type MappedTask = Tasks & {
    doers: TaskDoersData;
}
