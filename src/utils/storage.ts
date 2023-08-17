import { NAME_SPACE } from 'types';

export const addPrefix = (key: string) => NAME_SPACE + ':' + key;

export const haxPrefix = (key: string) => key.includes(NAME_SPACE);

export const removePrefix = (key: string) => key.replace(NAME_SPACE + ':', '');
