import { useUserStore } from '~/store/userStore';
const userStore = useUserStore();

export const mapValueToKey = (value: string | null, items: Array<{key: string, title: string}>) => {
  if (!value) {
    return;
  }

  return items.find(item => item.title === value)?.key;
};

export const mapKeyToValue = (value: string | null, items: Array<{key: string, title: string}>) => {
  if (!value) {
    return;
  }

  return items.find(item => item.key === value)?.title;
};

export const matchUserById = (id: string | null) => {
  if (!id) {
    return null;
  }
  if (userStore.availableUsers.length) {
    const user = userStore.availableUsers.find(user => user.id === id);

    return user?.initials || id;
  }
};
