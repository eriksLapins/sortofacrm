import { useUserStore } from '~/store/userStore';

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

export const mapArrayValueToKey = (value: Array<string> | [], items: Array<{key: string, title: string}>) => {
    if (!value.length) {
        return [];
    }

    const mappedItems = value.map((title) => {
        return items.find(item => item.title === title)?.key;
    });

    const filteredItems = mappedItems.filter(item => !!item) as string[];

    return filteredItems;
};

export const mapArrayKeyToValue = (value: Array<string> | [], items: Array<{key: string, title: string}>) => {
    if (!value.length) {
        return [];
    }

    const mappedItems = value.map((key) => {
        return items.find(item => item.key === key)?.title;
    });

    const filteredItems = mappedItems.filter(item => !!item) as string[];

    return filteredItems;
};

export const matchUserById = (id: number | null) => {
    if (!id) {
        return null;
    }
    if (useUserStore().availableUsers.length) {
        const user = useUserStore().availableUsers.find(user => user.id === id);

        return user?.initials || id;
    }
};
