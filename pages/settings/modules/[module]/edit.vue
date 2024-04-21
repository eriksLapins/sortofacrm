<template>
  <div class="flex flex-col gap-4 items-center">
    <h1 class="text-l font-bold w-full">
      Modules - {{ $route.params.module }} - edit
    </h1>
    <div v-if="generalError" class="text-error-border text-left w-full">
      {{ generalError.main }}
    </div>
    <div class="flex flex-col gap-4 w-full">
      <ModuleSettingsForm
        v-model="form"
        :errors="formErrors"
        :general-error="generalError"
      />
      <div class="separator" />
      <div v-if="!loading" class="flex justify-between max-lg:flex-col max-lg:gap-4">
        <UiButton
          class="self-center w-full md:w-[300px]"
          secondary
          @click="submit"
        >
          <span>Save</span>
        </UiButton>
        <UiButton popovertarget="before-delete" text="Delete Module" :error-variant="true" />
      </div>
      <LoadingAnimation v-else />
    </div>
    <div id="before-delete" popover class="border-2 border-primary border-solid w-[500px] p-6 backdrop:bg-[#00000099]">
      <div class="grid gap-4 items-center justify-center">
        <h2 class="font-bold">
          Are you sure you want to delete this module?
        </h2>
        <div>
          <p>
            Deleting this module also means deleting any and all data related to this module.
          </p>
          <UiButton
            :error-variant="true"
            text="Delete"
            @click="deleteModule"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ModuleFieldsAdjusted, ResponseError } from '~/types';

defineOptions({
    name: 'SettingsModuleEdit'
});

definePageMeta({
    layout: 'settings'
});

const route = useRoute();
const oldName = ref<string>();
const oldKey = ref<string>();
const oldFields = ref<ModuleFieldsAdjusted[]>([]);

const form = ref({
    name: '',
    key: '',
    fields: [] as ModuleFieldsAdjusted[]
});

const formErrors = ref<ResponseError>({});
const generalError = ref<{
  main: string,
  field: string
}>();
const loading = ref(false);

async function getModuleWithFields () {
    const response = await $fetch('/api/data/modules/getOne', {
        query: {
            module: route.params.module
        }
    });

    const jsonResponse = jsonParse(response);

    if ('data' in jsonResponse && jsonResponse.data) {
        const { data } = jsonResponse;
        oldKey.value = data.key;
        oldName.value = data.name;
        form.value.key = data.key;
        form.value.name = data.name;

        const responseFields = await $fetch(`/api/data/${data.key}/field`);
        const jsonResponseFields = jsonParse(responseFields);

        if (jsonResponseFields && 'data' in jsonResponseFields) {
            oldFields.value = [];
            for (const field of jsonResponseFields.data) {
                oldFields.value.push({ ...field });
            }
            form.value.fields = [...jsonResponseFields.data];
        }
    }
}

async function submit () {
    loading.value = true;
    formErrors.value = {};
    generalError.value = undefined;
    const fieldKeys: string[] = [];
    const fieldTitles: string[] = [];
    form.value.fields.forEach((field) => {
        if (field.title === '') {
            generalError.value = {
                main: 'Some fields are missing titles',
                field: 'Field is missing a title, please remove or input a title'
            };
        }
        if (fieldKeys.includes(field.key)) {
            formErrors.value = {
                data: {
                    fields: {
                        [`${field.key}`]: {
                            ...formErrors.value.data?.fields[field.key],
                            key: 'Duplicated field key'
                        }
                    }
                }
            };
        }
        fieldKeys.push(field.key);
        if (fieldTitles.includes(field.title)) {
            formErrors.value = {
                data: {
                    fields: {
                        [`${field.key}`]: {
                            ...formErrors.value.data?.fields[field.key],
                            title: 'Duplicated field title'
                        }
                    }
                }
            };
        }
        fieldTitles.push(field.title);
    });
    if (generalError.value) {
        loading.value = false;

        return;
    }

    if (formErrors.value.data) {
        loading.value = false;

        return;
    }

    if (form.value.name !== oldName.value || form.value.key !== oldKey.value) {
        try {
            const response = await $fetch('/api/data/modules', {
                method: 'PUT',
                body: {
                    oldName: oldName.value,
                    newName: form.value.name,
                    oldKey: oldKey.value,
                    newKey: form.value.key
                }
            });

            const jsonResponse = jsonParse(response);

            if ('success' in jsonResponse && jsonResponse.success) {
                oldName.value = form.value.name;
                oldKey.value = form.value.key;
            }
        } catch (e: any) {
            if (e.status === 400) {
                formErrors.value = { ...e.data.data.errors };
            } else if (e.status === 500) {
                loading.value = false;
                error500(e.data.message);
            } else {
                loading.value = false;
                error500('Something went wrong during module update');
            }
            loading.value = false;

            return;
        }
    }

    const deletedFields = oldFields.value.filter(field => !(form.value.fields
        .filter(item => !!item.id)
        .map(item => item.id)
        .includes(field.id))
    );

    const newFields = form.value.fields.filter(field => !field.id);

    const updatedFields = form.value.fields
        .filter(field => field.id)
        .filter(field => !!oldFields.value.find(item => item.id === field.id))
        .filter((field: Record<string, any>) => {
            const previous = oldFields.value.find(item => item.id === field.id) as Record<string, any>;

            if (!previous) {
                return false;
            }

            return JSON.stringify(previous) !== JSON.stringify(field);
        });

    if (updatedFields.length) {
        updatedFields.forEach(async (field) => {
            try {
                await $fetch(`/api/data/${oldKey.value}/field`, {
                    method: 'PUT',
                    body: {
                        id: field.id,
                        key: field.key,
                        module: field.module,
                        required: field.required,
                        title: field.title,
                        type: field.type,
                        valueType: field.valueType,
                        additional: field.additional,
                        position: +field.position
                    }
                });
            } catch (e: any) {
                if (e.status === 400) {
                    generalError.value = e.data.message;
                    formErrors.value = { ...e.data.data.errors };
                    loading.value = false;

                    return;
                }
                console.log(e);
                loading.value = false;
                error500(e.data.message);
            }
        });
    }

    if (formErrors.value.data) {
        console.log(formErrors.value.data);
        loading.value = false;

        return;
    }

    if (newFields.length) {
        const mappedNewFields = newFields.map((field) => {
            return {
                ...field,
                module: oldKey.value
            };
        });
        try {
            await $fetch(`/api/data/${oldKey.value}/field`, {
                method: 'POST',
                body: {
                    fields: mappedNewFields

                }
            });
        } catch (e: any) {
            if (e.status === 400) {
                formErrors.value = { ...e.data.data.errors };
                loading.value = false;

                return;
            }
            console.log(e);
            loading.value = false;
            error500(e.data.message);
        }
    }

    if (formErrors.value.data) {
        loading.value = false;

        return;
    }

    if (deletedFields.length) {
        deletedFields.forEach(async (field) => {
            try {
                await $fetch(`/api/data/${oldKey.value}/field`, {
                    method: 'DELETE',
                    body: {
                        key: field.key
                    }
                });
            } catch (e: any) {
                if (e.status === 400) {
                    generalError.value = e.data.message;
                    loading.value = false;

                    return;
                }
                console.log(e);
                loading.value = false;
                error500(e.data.message);
            }
        });
    }

    if (formErrors.value.data) {
        loading.value = false;

        return;
    }

    loading.value = false;
    // otherwise prisma is being lazy and takes from the cache and no values change

    await getModuleWithFields();
}

async function deleteModule () {
    await $fetch('/api/data/modules', {
        method: 'DELETE',
        body: {
            module: route.params.module
        }
    });

    navigateTo('/settings/modules');
}

onMounted(async () => {
    await getModuleWithFields();
    form.value.fields.sort((a, b) => a.position - b.position);
});

</script>
