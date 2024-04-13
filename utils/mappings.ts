import { useUserStore } from '~/store/userStore';
import type { MultiSelect } from '~/types';

export const mapValueToKey = (value: string | number | boolean | null, items: MultiSelect[]) => {
    if (!value) {
        return;
    }

    return items.find(item => item.title === value)?.key;
};

export const mapKeyToValue = (value: string | number | boolean | null, items: MultiSelect[]) => {
    if (!value) {
        return;
    }

    return items.find(item => item.key === value)?.title;
};

export const mapArrayValueToKey = (value: (string | number)[] | [], items: MultiSelect[]) => {
    if (!value.length) {
        return [];
    }

    const mappedItems = value.map((title) => {
        return items.find(item => item.title === title)?.key;
    });

    const filteredItems = mappedItems.filter(item => !!item) as (string | number)[];

    return filteredItems;
};

export const mapArrayKeyToValue = (value: (string | number)[] | [], items: MultiSelect[]) => {
    if (!value.length) {
        return [];
    }

    const mappedItems = value.map((key) => {
        return items.find(item => item.key === key)?.title;
    });

    const filteredItems = mappedItems.filter(item => !!item) as (string | number)[];

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
