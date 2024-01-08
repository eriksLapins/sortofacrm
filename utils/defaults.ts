import { EPermissionTypes, type Pages, type Permissions } from '@prisma/client';
const allDefaultPages: Omit<Pages, 'id' | 'userId'>[] = [
    {
        name: 'main',
        title: 'Dashboard',
        position: 0
    },
    {
        name: 'datasets',
        title: 'Data',
        position: 1
    },
    {
        name: 'reports',
        title: 'Reports',
        position: 2
    },
    {
        name: 'settings',
        title: 'Settings',
        position: 1000
    }
];

const defaultPages: Omit<Pages, 'id' | 'userId'>[] = [
    {
        name: 'main',
        title: 'Dashboard',
        position: 0
    },
    {
        name: 'datasets',
        title: 'Data',
        position: 1
    },
    {
        name: 'reports',
        title: 'Reports',
        position: 2
    },
    {
        name: 'settings',
        title: 'Settings',
        position: 1000
    }
];

const defaultPermissionsSimple: Omit<Permissions, 'id' | 'userId'>[] = [
    {
        module: 'dashboard',
        can: EPermissionTypes.CREATE_OWN
    },
    {
        module: 'dashboard',
        can: EPermissionTypes.READ_OWN
    },
    {
        module: 'dashboard',
        can: EPermissionTypes.DELETE_OWN
    },
    {
        module: 'dashboard',
        can: EPermissionTypes.UPDATE_OWN
    },
    {
        module: 'tasks',
        can: EPermissionTypes.CREATE_OWN
    },
    {
        module: 'tasks',
        can: EPermissionTypes.READ_OWN
    },
    {
        module: 'tasks',
        can: EPermissionTypes.DELETE_OWN
    },
    {
        module: 'tasks',
        can: EPermissionTypes.UPDATE_OWN
    },
    {
        module: 'quotes',
        can: EPermissionTypes.CREATE_OWN
    },
    {
        module: 'quotes',
        can: EPermissionTypes.READ_OWN
    },
    {
        module: 'quotes',
        can: EPermissionTypes.DELETE_OWN
    },
    {
        module: 'quotes',
        can: EPermissionTypes.UPDATE_OWN
    },
    {
        module: 'reports',
        can: EPermissionTypes.CREATE_OWN
    },
    {
        module: 'reports',
        can: EPermissionTypes.READ_OWN
    },
    {
        module: 'reports',
        can: EPermissionTypes.DELETE_OWN
    },
    {
        module: 'reports',
        can: EPermissionTypes.UPDATE_OWN
    },
    {
        module: 'settings',
        can: EPermissionTypes.CREATE_OWN
    },
    {
        module: 'settings',
        can: EPermissionTypes.READ_OWN
    },
    {
        module: 'settings',
        can: EPermissionTypes.DELETE_OWN
    },
    {
        module: 'settings',
        can: EPermissionTypes.UPDATE_OWN
    }
];

const defaultPermissionsAdmin: Omit<Permissions, 'id' | 'userId'>[] = [];

allDefaultPages.forEach(page => defaultPermissionsAdmin.push(
    {
        module: page.name,
        can: EPermissionTypes.CREATE_ALL
    },
    {
        module: page.name,
        can: EPermissionTypes.READ_ALL
    },
    {
        module: page.name,
        can: EPermissionTypes.DELETE_ALL
    },
    {
        module: page.name,
        can: EPermissionTypes.UPDATE_ALL
    }
));

const defaultBlockSizes = {
    width: 3,
    height: 3
};

export {
    allDefaultPages,
    defaultBlockSizes,
    defaultPages,
    defaultPermissionsAdmin,
    defaultPermissionsSimple
};
