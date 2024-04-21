import type { SerializeObject } from 'nitropack';

type Flatten<T> = T extends Array<SerializeObject<infer R>> ? Array<R> :
T extends Array<{data: SerializeObject<infer R>}> ? Array<{data: R}> :
T extends Record<string, infer R> ? Record<string, R> :
T extends SerializeObject<infer R> ? R :
T

type DeepFlatten<T> = T extends SerializeObject<Record<string, Array<SerializeObject<infer R>>>> ? Record<string, Array<R>> :
T extends SerializeObject<Record<string, SerializeObject<infer R>>> ? Record<string, R> :
T

export default function jsonParse <T> (data: T): Flatten<T> | DeepFlatten<T> {
    return JSON.parse(JSON.stringify(data));
}
