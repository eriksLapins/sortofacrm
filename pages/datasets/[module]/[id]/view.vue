<template>
  <div v-if="loading" class="pt-48 mx-auto">
    <LoadingAnimation large-size />
  </div>
  <div v-else-if="task" class="lg:container mx-auto py-8 px-6 md:px-8">
    <ItemHeader
      module-name="tasks"
      :item="headerItem!"
    />
    <PageContent
      :title="task.title"
      :title-append="task.done ? 'Done' : undefined"
    >
      <PageBlockStatic class="flex flex-col gap-4 lg:w-1/2 lg:border border-solid border-primary p-4">
        <div class="flex flex-col gap-4">
          <div class="flex flex-col">
            <div class="flex flex-col gap-2 md:flex-row md:gap-4 md:items-center">
              <div>Manager: {{ matchUserById(task.managerId) || 'unspecified' }}</div>
              <div class="flex gap-2 items-center">
                Task doers:
                <div class="flex flex-row gap-2">
                  <ul v-if="taskDoerIds.length" class="flex gap-2 items-center">
                    <li v-for="item in taskDoerIds" :key="item" class="leading-none rounded-full w-8 h-8 border-solid border-primary border-2 flex justify-center items-center">
                      {{ findUserById(item)?.initials }}
                    </li>
                  </ul>
                  <p v-else class="flex items-center">
                    undefined
                  </p>
                  <UiMultiSelect
                    v-model:model-value="taskDoerIds"
                    :items="userOptions"
                    name="task-doer-ids"
                    label="Search doers"
                    as-button
                    @update:model-value="usersUpdated = true"
                  />
                  <UiButton
                    v-if="usersUpdated"
                    text="Update"
                    @click="updateTaskDoers"
                  />
                </div>
              </div>
            </div>
            <div>Activity type: {{ task.activityTypeId }}</div>
            <div class="text-sm">
              Starting date: {{ task.startDate ? format(new Date(task.startDate), 'yyyy-MM-dd') : 'not defined' }}
            </div>
            <div class="text-sm">
              To do until: {{ task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : 'not defined' }}
            </div>
          </div>
        </div>
        <div class="text-gray">
          {{ task.description }}
        </div>
      </PageBlockStatic>

      <pre>
          {{ task }}
        </pre>
    </PageContent>
  </div>
</template>

<script setup lang="ts">
import type { TaskDoers, Tasks } from '@prisma/client';
import format from 'date-fns/format';
import { useUserStore } from '~/store/userStore';

defineOptions({
    name: 'ViewTasksIndex'
});

const route = useRoute();
const id = route.params.id;

const userStore = useUserStore();
const task = ref<Tasks>();
const loading = ref(true);
const userOptions = ref<{key: string, title: string}[]>([]);
const usersUpdated = ref(false);
const initialDoersList = ref<string[]>([]);

async function fetchTaskById () {
    try {
        const { data } = await $fetch('/api/data/tasks/items', {
            query: {
                createdById: userStore.currentUserId,
                id
            }
        });

        const jsonTask = JSON.parse(JSON.stringify(data));

        task.value = jsonTask.tasks[0];
        loading.value = false;
    } catch (e) {
        console.log(e);
        throw new Error('Sorry, something went wrong');
    }
}

const taskDoerIds = ref<Array<string>>([]);

const headerItem = computed(() => {
    if (task.value) {
        return {
            id: task.value.id,
            updatedOn: task.value.updatedOn,
            createdBy: task.value.createdById,
            updatedBy: task.value.updatedById
        };
    }

    return undefined;
});

function findUserById (id: number) {
    return userStore.availableUsers.find(user => user.id === id);
}

async function updateTaskDoers () {
    const doersToAdd = taskDoerIds.value.filter(doer => !initialDoersList.value?.includes(doer));
    const doersToDelete = initialDoersList.value?.filter(doer => !taskDoerIds.value.includes(doer));
    if (doersToAdd.length) {
        await $fetch('/api/data/tasks/doers/create', {
            method: 'POST',
            body: {
                taskId: id,
                doerId: doersToAdd
            }
        }).catch(() => {
            throw createError({
                statusCode: 500,
                statusMessage: 'Sorry, something went wrong when adding users'
            });
        }); ;
    }

    if (doersToDelete.length) {
        await $fetch('/api/data/tasks/doers/delete', {
            method: 'POST',
            body: {
                taskId: id,
                doerId: doersToDelete
            }
        }).catch(() => {
            throw createError({
                statusCode: 500,
                statusMessage: 'Sorry, something went wrong when removing users'
            });
        });
    }
}

async function fetchTaskDoers () {
    const { data } = await $fetch('/api/data/tasks/doers/get', {
        method: 'POST',
        body: {
            taskId: id
        }
    }).catch(() => {
        throw createError({
            statusCode: 500,
            message: 'Sorry, something went wrong, please try again later'
        });
    });

    const jsonData = JSON.parse(JSON.stringify(data)) as TaskDoers[];

    taskDoerIds.value = jsonData.map(item => item.doerId);
    initialDoersList.value = jsonData.map(item => item.doerId);
}

onBeforeMount(async () => {
    await fetchTaskById();
    await fetchTaskDoers();
    if (!userStore.availableUsers.length) {
        await userStore.fetchUsers();
    }
    userOptions.value = userStore.availableUsers?.map((user) => {
        return {
            key: user.id,
            title: `${user.name} ${user.lastname}`
        };
    });
});

</script>

<style scoped>

</style>
