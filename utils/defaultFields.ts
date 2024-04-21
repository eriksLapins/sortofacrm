import type { ModuleItems } from '@prisma/client';
import type { ModuleFieldsAdjusted } from '~/types';

export const defaultFieldsList: (keyof Omit<ModuleItems, 'data'>)[] = [
    'id',
    'createdById',
    'createdOn',
    'updatedById',
    'updatedOn',
    'module'
];

export function createDefaultFields (): ModuleFieldsAdjusted[] {
    return [
        {
            key: 'id',
            additional: {},
            module: '',
            required: true,
            title: 'ID',
            type: 'number',
            valueType: 'autoincrement',
            position: 1
        },
        {
            key: 'createdById',
            additional: {},
            module: '',
            required: true,
            title: 'Created By ID',
            type: 'number',
            valueType: 'number',
            position: 2
        },
        {
            key: 'createdOn',
            additional: {},
            module: '',
            required: true,
            title: 'Created On',
            type: 'datepicker',
            valueType: 'datetime',
            position: 3
        },
        {
            key: 'updatedById',
            additional: {},
            module: '',
            required: true,
            title: 'Updated By ID',
            type: 'number',
            valueType: 'number',
            position: 4
        },
        {
            key: 'updatedOn',
            additional: {},
            module: '',
            required: true,
            title: 'Updated On',
            type: 'datepicker',
            valueType: 'datetime',
            position: 5
        },
        {
            key: 'module',
            additional: {},
            module: '',
            required: true,
            title: 'Module',
            type: 'text',
            valueType: 'string',
            position: 6
        }
    ];
}
