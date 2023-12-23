import { EPermissionTypes, type Pages, type TPermissions } from '@prisma/client';
const allDefaultPages: Omit<Pages, 'id' | 'clientId' | 'userId'>[] = [
  {
    name: 'main',
    title: 'Dashboard',
    order: 0
  },
  {
    name: 'datasets',
    title: 'Data',
    order: 1
  },
  {
    name: 'reports',
    title: 'Reports',
    order: 2
  },
  {
    name: 'settings',
    title: 'Settings',
    order: 1000
  }
];

const defaultPages: Omit<Pages, 'id' | 'clientId' | 'userId'>[] = [
  {
    name: 'main',
    title: 'Dashboard',
    order: 0
  },
  {
    name: 'datasets',
    title: 'Data',
    order: 1
  },
  {
    name: 'reports',
    title: 'Reports',
    order: 2
  },
  {
    name: 'settings',
    title: 'Settings',
    order: 1000
  }
];

const defaultPermissionsSimple: Omit<TPermissions, 'clientId' | 'id' | 'userId'>[] = [
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

const defaultPermissionsAdmin: Omit<TPermissions, 'clientId' | 'id' | 'userId'>[] = [];

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
