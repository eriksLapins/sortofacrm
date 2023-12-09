import type { EPreferenceTypes } from '@prisma/client';

export type Preferences = {
    key: string,
    title: string,
    position: number,
    visible: boolean,
}

export type PreferenceWrapper = {
    [key: string]: {
        [key in keyof typeof EPreferenceTypes]: Preferences[]
    }
}
