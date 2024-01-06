import type { ModuleFields } from '@prisma/client';
import type { AdditionalsJson } from './AdditionalsJson';

export interface ModuleFieldsAdjusted extends Omit<ModuleFields, 'id'> {
    additional: AdditionalsJson;
}
